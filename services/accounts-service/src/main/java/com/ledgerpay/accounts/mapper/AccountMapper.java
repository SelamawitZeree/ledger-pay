package com.ledgerpay.accounts.mapper;

import com.ledgerpay.accounts.domain.Account;
import com.ledgerpay.accounts.dto.AccountDto;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    Account toEntity(AccountDto dto);

    AccountDto toDto(Account entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(AccountDto dto, @MappingTarget Account entity);
}
