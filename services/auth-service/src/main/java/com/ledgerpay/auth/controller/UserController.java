package com.ledgerpay.auth.controller;

import com.ledgerpay.auth.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final JwtService jwtService;
    
    // In-memory storage for demo purposes - replace with database in production
    private final Map<String, UserRegistration> registeredUsers = new ConcurrentHashMap<>();
    private final AtomicLong userIdCounter = new AtomicLong(1);

    public UserController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public record UserRegistration(
        Long id,
        String username,
        String email,
        String firstName,
        String lastName,
        String password,
        String tenantId,
        String role,
        String companyName,
        String phoneNumber
    ) {}

    public record RegisterRequest(
        @NotBlank @Size(min = 3, max = 50) String username,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 2, max = 50) String firstName,
        @NotBlank @Size(min = 2, max = 50) String lastName,
        @NotBlank @Size(min = 8) String password,
        @NotBlank @Size(min = 2, max = 100) String companyName,
        String phoneNumber,
        @NotBlank String role
    ) {}

    public record RegisterResponse(
        Long id,
        String username,
        String email,
        String tenantId,
        String role,
        String accessToken,
        String message
    ) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        // Check if username already exists
        if (registeredUsers.containsKey(request.username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "Username already exists", "code", "USERNAME_EXISTS"));
        }

        // Check if email already exists
        boolean emailExists = registeredUsers.values().stream()
            .anyMatch(user -> user.email.equals(request.email));
        if (emailExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "Email already exists", "code", "EMAIL_EXISTS"));
        }

        // Generate professional tenant ID
        String tenantId = generateTenantId(request.companyName);
        
        // Create user registration
        UserRegistration user = new UserRegistration(
            userIdCounter.getAndIncrement(),
            request.username,
            request.email,
            request.firstName,
            request.lastName,
            request.password, // In production, hash this password
            tenantId,
            request.role,
            request.companyName,
            request.phoneNumber
        );

        // Store user
        registeredUsers.put(request.username, user);

        // Generate JWT token
        String accessToken = jwtService.generateAccessToken(request.username, tenantId, request.role);

        RegisterResponse response = new RegisterResponse(
            user.id(),
            user.username(),
            user.email(),
            user.tenantId(),
            user.role(),
            accessToken,
            "User registered successfully"
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<Map<String, Boolean>> checkUsername(@PathVariable String username) {
        boolean exists = registeredUsers.containsKey(username);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@PathVariable String email) {
        boolean exists = registeredUsers.values().stream()
            .anyMatch(user -> user.email.equals(email));
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable String username) {
        UserRegistration user = registeredUsers.get(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "User not found"));
        }

        // Return user profile without sensitive data
        return ResponseEntity.ok(Map.of(
            "id", user.id(),
            "username", user.username(),
            "email", user.email(),
            "firstName", user.firstName(),
            "lastName", user.lastName(),
            "tenantId", user.tenantId(),
            "role", user.role(),
            "companyName", user.companyName(),
            "phoneNumber", user.phoneNumber() != null ? user.phoneNumber() : ""
        ));
    }

    private String generateTenantId(String companyName) {
        String cleanName = companyName.toUpperCase()
            .replaceAll("[^A-Z0-9]", "-")
            .replaceAll("-+", "-")
            .replaceAll("^-|-$", "");
        
        String timestamp = String.valueOf(System.currentTimeMillis()).substring(8);
        return String.format("TENANT-%s-%s", cleanName, timestamp);
    }
}
