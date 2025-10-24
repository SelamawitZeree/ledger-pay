package com.ledgerpay.audit.controller;

import com.ledgerpay.audit.domain.AuditLog;
import com.ledgerpay.audit.repo.AuditLogRepository;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
public class AuditController {
    private final AuditLogRepository repo;

    @PostMapping
    public ResponseEntity<Void> append(@RequestBody Map<String, String> req){
        UUID tenantId = UUID.fromString(req.get("tenantId"));
        String action = req.get("action");
        String entityType = req.get("entityType");
        UUID entityId = req.get("entityId")!=null?UUID.fromString(req.get("entityId")):null;
        String details = req.get("details");
        String actor = req.get("actor");
        repo.save(AuditLog.builder().tenantId(tenantId).action(action).entityType(entityType).entityId(entityId).details(details).actor(actor).build());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public List<AuditLog> list(@RequestParam @NotNull UUID tenantId){
        return repo.findByTenantIdOrderByCreatedAtDesc(tenantId);
    }
}
