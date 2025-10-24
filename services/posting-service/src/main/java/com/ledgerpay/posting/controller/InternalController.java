package com.ledgerpay.posting.controller;

import com.ledgerpay.posting.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/internal")
@RequiredArgsConstructor
public class InternalController {
    private final TransactionService service;

    @GetMapping("/balance")
    public Map<String,Object> balance(@RequestParam UUID accountId){
        BigDecimal b = service.balanceForAccount(accountId);
        return Map.of("accountId", accountId, "balance", b);
    }
}
