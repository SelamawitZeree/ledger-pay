package com.ledgerpay.accounts.service;

import com.ledgerpay.accounts.domain.Account;
import com.ledgerpay.accounts.dto.AccountDto;
import com.ledgerpay.accounts.repo.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository repo;
    // MapStruct has been unreliable in container; do manual mapping for DTO conversion

    @Transactional(readOnly = true)
    public List<AccountDto> list(UUID tenantId){
        return repo.findByTenantId(tenantId).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public AccountDto get(UUID tenantId, UUID id){
        var entity = repo.findByTenantIdAndId(tenantId, id).orElseThrow(() -> new IllegalArgumentException("Account not found"));
        return toDto(entity);
    }

    @Transactional
    public AccountDto create(AccountDto dto){
        if(repo.existsByTenantIdAndCode(dto.tenantId(), dto.code())){
            throw new IllegalArgumentException("Account code already exists");
        }
        Account entity = Account.builder()
                .tenantId(dto.tenantId())
                .code(dto.code())
                .name(dto.name())
                .type(dto.type())
                .currency(dto.currency())
                .status(dto.status())
                .ownerType(dto.ownerType())
                .ownerRefId(dto.ownerRefId())
                .build();
        return toDto(repo.save(entity));
    }

    @Transactional
    public AccountDto update(UUID tenantId, UUID id, AccountDto dto){
        var entity = repo.findByTenantIdAndId(tenantId, id).orElseThrow(() -> new IllegalArgumentException("Account not found"));
        if(dto.code() != null) entity.setCode(dto.code());
        if(dto.name() != null) entity.setName(dto.name());
        if(dto.type() != null) entity.setType(dto.type());
        if(dto.currency() != null) entity.setCurrency(dto.currency());
        if(dto.status() != null) entity.setStatus(dto.status());
        if(dto.ownerType() != null) entity.setOwnerType(dto.ownerType());
        if(dto.ownerRefId() != null) entity.setOwnerRefId(dto.ownerRefId());
        return toDto(repo.save(entity));
    }

    private AccountDto toDto(Account e){
        return new AccountDto(
                e.getId(),
                e.getTenantId(),
                e.getCode(),
                e.getName(),
                e.getType(),
                e.getCurrency(),
                e.getStatus(),
                e.getOwnerType(),
                e.getOwnerRefId()
        );
    }
}
