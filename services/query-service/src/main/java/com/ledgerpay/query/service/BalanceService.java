package com.ledgerpay.query.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BalanceService {
    @Value("${services.posting.url:http://localhost:8082}")
    private String postingServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public BigDecimal getBalance(UUID accountId){
        var resp = restTemplate.getForObject(postingServiceUrl + "/api/v1/internal/balance?accountId="+accountId, Map.class);
        if(resp == null) return BigDecimal.ZERO;
        Object bal = resp.get("balance");
        return new BigDecimal(String.valueOf(bal));
    }
}
