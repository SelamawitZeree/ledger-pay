package com.ledgerpay.auth.dto;

public record RegisterResponse(
    Long id,
    String username,
    String email,
    String tenantId,
    String role,
    String accessToken,
    String message
) {}
