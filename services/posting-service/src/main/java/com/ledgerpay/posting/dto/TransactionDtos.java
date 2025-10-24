package com.ledgerpay.posting.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class TransactionDtos {
    public record PostRequest(
            @NotNull UUID tenantId,
            @NotBlank String reference,
            @NotNull OffsetDateTime timestamp,
            @NotEmpty List<@Valid Line> lines
    ) {}

    public record Line(
            @NotNull UUID accountId,
            @DecimalMin(value = "0.00") BigDecimal debit,
            @DecimalMin(value = "0.00") BigDecimal credit,
            @Size(max = 256) String memo
    ) {}

    public record Response(
            UUID id,
            String reference
    ) {}
}
