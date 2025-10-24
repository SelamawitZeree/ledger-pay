package com.ledgerpay.posting.repo;

import com.ledgerpay.posting.domain.LedgerTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LedgerTransactionRepository extends JpaRepository<LedgerTransaction, UUID> {
    List<LedgerTransaction> findByTenantIdOrderByTimestampDesc(UUID tenantId);
}
