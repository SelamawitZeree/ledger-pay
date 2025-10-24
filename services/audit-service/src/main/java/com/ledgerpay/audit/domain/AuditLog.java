package com.ledgerpay.audit.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(nullable = false, length = 32)
    private String action;

    @Column(name = "entity_type", length = 64)
    private String entityType;

    @Column(name = "entity_id")
    private UUID entityId;

    @Column(length = 512)
    private String details;

    @Column(name = "actor", length = 64)
    private String actor;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}
