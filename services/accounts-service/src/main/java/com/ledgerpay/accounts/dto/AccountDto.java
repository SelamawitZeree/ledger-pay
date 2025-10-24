package com.ledgerpay.accounts.dto;

import com.ledgerpay.accounts.domain.Account;
import jakarta.validation.constraints.*;

import java.util.UUID;

public record AccountDto(
        UUID id,
        UUID tenantId,
        @NotBlank @Size(max = 32) String code,
        @NotBlank @Size(max = 128) String name,
        @NotNull Account.AccountType type,
        @Pattern(regexp = "^[A-Z]{3}$") String currency,
        @NotNull Account.AccountStatus status,
        String ownerType,
        UUID ownerRefId
) {}
