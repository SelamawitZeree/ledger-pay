package com.ledgerpay.auth.controller;

import com.ledgerpay.auth.domain.User;
import com.ledgerpay.auth.repository.UserRepository;
import com.ledgerpay.auth.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthController(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam("username") String username,
                                   @RequestParam("password") String password) {
        // Find user in database
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }
        
        User user = userOpt.get();
        
        // Validate password (in production, use proper password hashing)
        if (!user.getPassword().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }
        
        // Generate JWT token
        String token = jwtService.generateAccessToken(username, user.getTenantId(), user.getRole());
        
        // Create cookie
        ResponseCookie cookie = ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .path("/")
                .sameSite("Lax")
                .build();
        
        // Return token and user info
        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(Map.of(
                    "accessToken", token,
                    "username", username,
                    "tenantId", user.getTenantId(),
                    "role", user.getRole()
                ));
    }
}
