package com.ledgerpay.posting.service;

import com.ledgerpay.posting.domain.LedgerTransaction;
import com.ledgerpay.posting.domain.TransactionLine;
import com.ledgerpay.posting.dto.TransactionDtos;
import com.ledgerpay.posting.repo.LedgerTransactionRepository;
import com.ledgerpay.posting.repo.TransactionLineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final LedgerTransactionRepository txRepo;
    private final TransactionLineRepository lineRepo;

    @Value("${services.audit.url:http://localhost:8084}")
    private String auditServiceUrl;

    @Value("${services.query.url:http://localhost:8083}")
    private String queryServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Transactional
    public UUID post(UUID tenantId, String actor, TransactionDtos.PostRequest req){
        if(!tenantId.equals(req.tenantId())) throw new IllegalArgumentException("Invalid tenant");
        if(req.lines().isEmpty()) throw new IllegalArgumentException("Lines required");

        BigDecimal totalDr = BigDecimal.ZERO;
        BigDecimal totalCr = BigDecimal.ZERO;
        LedgerTransaction tx = LedgerTransaction.builder()
                .tenantId(tenantId)
                .reference(req.reference())
                .timestamp(req.timestamp() == null ? OffsetDateTime.now() : req.timestamp())
                .status(LedgerTransaction.Status.POSTED)
                .createdBy(actor)
                .build();

        for (var l : req.lines()){
            if((l.debit()==null?BigDecimal.ZERO:l.debit()).signum() > 0 && (l.credit()==null?BigDecimal.ZERO:l.credit()).signum() > 0)
                throw new IllegalArgumentException("Line cannot have both debit and credit");
            if((l.debit()==null?BigDecimal.ZERO:l.debit()).signum() == 0 && (l.credit()==null?BigDecimal.ZERO:l.credit()).signum() == 0)
                throw new IllegalArgumentException("Line must have debit or credit");
            totalDr = totalDr.add(l.debit()==null?BigDecimal.ZERO:l.debit());
            totalCr = totalCr.add(l.credit()==null?BigDecimal.ZERO:l.credit());
            tx.getLines().add(TransactionLine.builder()
                    .transaction(tx)
                    .accountId(l.accountId())
                    .debit(l.debit())
                    .credit(l.credit())
                    .memo(l.memo())
                    .build());
        }
        if(totalDr.compareTo(totalCr) != 0) throw new IllegalArgumentException("Debits and credits must balance");

        UUID id = txRepo.save(tx).getId();
        // Notify audit-service
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            restTemplate.postForEntity(auditServiceUrl + "/api/v1/audit", new HttpEntity<>(Map.of(
                    "tenantId", tenantId.toString(),
                    "action", "TX_POSTED",
                    "entityType", "LedgerTransaction",
                    "entityId", id.toString(),
                    "details", req.reference(),
                    "actor", actor
            ), headers), Void.class);
        } catch (Exception ignored) {}
        // Notify query-service webhook
        try {
            restTemplate.postForEntity(queryServiceUrl + "/api/v1/webhooks/transaction-posted", Map.of(
                    "tenantId", tenantId.toString(),
                    "transactionId", id.toString()
            ), Void.class);
        } catch (Exception ignored) {}
        return id;
    }

    @Transactional(readOnly = true)
    public BigDecimal balanceForAccount(UUID accountId){
        return lineRepo.balanceForAccount(accountId);
    }
}
