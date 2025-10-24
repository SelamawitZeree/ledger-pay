package com.ledgerpay.accounts.controller;

import com.ledgerpay.accounts.security.JwtService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final JwtService jwtService;

    public AuthController(JwtService jwtService) {this.jwtService = jwtService;}

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> login(@RequestParam("username") @NotBlank String username,
                                                    @RequestParam("tenantId") @NotBlank String tenantId,
                                                    @RequestParam(value = "role", defaultValue = "USER") String role){
        String token = jwtService.generateAccessToken(username, tenantId, role);
        ResponseCookie cookie = ResponseCookie.from("access_token", token)
                .httpOnly(true).path("/").sameSite("Lax").build();
        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(Map.of("accessToken", token));
    }
}
