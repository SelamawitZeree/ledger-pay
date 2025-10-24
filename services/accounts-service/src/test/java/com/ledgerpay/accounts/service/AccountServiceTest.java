package com.ledgerpay.accounts.service;

import com.ledgerpay.accounts.domain.Account;
import com.ledgerpay.accounts.repo.AccountRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class AccountServiceTest {
    @Test
    void list_returns_accounts() {
        AccountRepository repo = Mockito.mock(AccountRepository.class);
        AccountService service = new AccountService(repo);
        UUID tenant = UUID.randomUUID();
        Account acc = Account.builder().id(UUID.randomUUID()).tenantId(tenant).code("1000").name("Cash").type(Account.AccountType.ASSET).currency("USD").status(Account.AccountStatus.ACTIVE).build();
        when(repo.findByTenantId(tenant)).thenReturn(List.of(acc));
        var list = service.list(tenant);
        assertEquals(1, list.size());
        assertEquals("1000", list.get(0).code());
    }
}
