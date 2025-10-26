package com.ledgerpay.auth.dto;

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
