package com.ledgerpay.posting.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "transaction_lines")
public class TransactionLine {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id")
    private LedgerTransaction transaction;

    @Column(name = "account_id", nullable = false)
    private UUID accountId;

    @Column(precision = 19, scale = 4)
    private BigDecimal debit;

    @Column(precision = 19, scale = 4)
    private BigDecimal credit;

    @Column(length = 256)
    private String memo;
}
