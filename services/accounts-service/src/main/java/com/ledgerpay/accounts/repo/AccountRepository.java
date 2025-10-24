package com.ledgerpay.accounts.repo;

import com.ledgerpay.accounts.domain.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {
    List<Account> findByTenantId(UUID tenantId);
    Optional<Account> findByTenantIdAndId(UUID tenantId, UUID id);
    boolean existsByTenantIdAndCode(UUID tenantId, String code);
}
