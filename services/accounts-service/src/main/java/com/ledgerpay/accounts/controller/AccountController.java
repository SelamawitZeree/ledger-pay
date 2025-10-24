package com.ledgerpay.accounts.controller;

import com.ledgerpay.accounts.dto.AccountDto;
import com.ledgerpay.accounts.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService service;

    private UUID tenantId(Authentication authentication){
        if(authentication == null || authentication.getDetails() == null) throw new IllegalArgumentException("Unauthenticated");
        Object tenant = ((java.util.Map<?,?>) authentication.getDetails()).get("tenantId");
        return UUID.fromString(String.valueOf(tenant));
    }

    @GetMapping
    public List<AccountDto> list(Authentication auth){
        return service.list(tenantId(auth));
    }

    @GetMapping("/{id}")
    public AccountDto get(Authentication auth, @PathVariable UUID id){
        return service.get(tenantId(auth), id);
    }

    @PostMapping
    public ResponseEntity<AccountDto> create(Authentication auth, @Valid @RequestBody AccountDto dto){
        UUID tid = tenantId(auth);
        AccountDto withTenant = new AccountDto(
                dto.id(),
                tid,
                dto.code(),
                dto.name(),
                dto.type(),
                dto.currency(),
                dto.status(),
                dto.ownerType(),
                dto.ownerRefId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(withTenant));
    }

    @PutMapping("/{id}")
    public AccountDto update(Authentication auth, @PathVariable UUID id, @Valid @RequestBody AccountDto dto){
        return service.update(tenantId(auth), id, dto);
    }
}
