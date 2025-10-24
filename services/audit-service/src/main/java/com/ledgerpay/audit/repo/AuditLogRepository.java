package com.ledgerpay.audit.repo;

import com.ledgerpay.audit.domain.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    List<AuditLog> findByTenantIdOrderByCreatedAtDesc(UUID tenantId);
}
