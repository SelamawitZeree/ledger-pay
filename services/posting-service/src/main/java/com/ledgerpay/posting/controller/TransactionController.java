package com.ledgerpay.posting.controller;

import com.ledgerpay.posting.dto.TransactionDtos;
import com.ledgerpay.posting.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService service;

    private UUID tenantId(Authentication authentication){
        if(authentication == null || authentication.getDetails() == null) throw new IllegalArgumentException("Unauthenticated");
        Object tenant = ((java.util.Map<?,?>) authentication.getDetails()).get("tenantId");
        return UUID.fromString(String.valueOf(tenant));
    }

    private String actor(Authentication auth){
        return auth==null?"system":auth.getName();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> post(Authentication auth, @Valid @RequestBody TransactionDtos.PostRequest req){
        UUID id = service.post(tenantId(auth), actor(auth), req);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", id));
    }
}
