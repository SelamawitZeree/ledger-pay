package com.ledgerpay.posting.repo;

import com.ledgerpay.posting.domain.TransactionLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.UUID;

public interface TransactionLineRepository extends JpaRepository<TransactionLine, UUID> {
    @Query("select coalesce(sum(coalesce(tl.debit,0) - coalesce(tl.credit,0)),0) from TransactionLine tl where tl.accountId = :accountId")
    BigDecimal balanceForAccount(@Param("accountId") UUID accountId);
}
