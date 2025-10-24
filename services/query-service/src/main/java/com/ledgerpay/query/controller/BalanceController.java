package com.ledgerpay.query.controller;

import com.ledgerpay.query.service.BalanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BalanceController {
    private final BalanceService balances;
    private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    private UUID tenantId(Authentication authentication){
        if(authentication == null || authentication.getDetails() == null) throw new IllegalArgumentException("Unauthenticated");
        Object tenant = ((java.util.Map<?,?>) authentication.getDetails()).get("tenantId");
        return UUID.fromString(String.valueOf(tenant));
    }

    @GetMapping("/accounts/{accountId}/balance")
    public Map<String, Object> balance(Authentication auth, @PathVariable UUID accountId){
        BigDecimal bal = balances.getBalance(accountId);
        return Map.of("accountId", accountId, "balance", bal);
    }

    @GetMapping(value = "/balances/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(){
        SseEmitter emitter = new SseEmitter(0L);
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        return emitter;
    }

    @PostMapping("/webhooks/transaction-posted")
    public void webhookTxPosted(@RequestBody Map<String, String> body){
        for (SseEmitter emitter : emitters){
            try {
                emitter.send(SseEmitter.event().name("transaction").data(body.get("transactionId")));
            } catch (IOException e) {
                emitter.complete();
                emitters.remove(emitter);
            }
        }
    }
}
