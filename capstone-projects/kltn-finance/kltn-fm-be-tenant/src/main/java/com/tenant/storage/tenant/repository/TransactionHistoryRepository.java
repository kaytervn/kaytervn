package com.tenant.storage.tenant.repository;

import com.tenant.storage.tenant.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory, Long>, JpaSpecificationExecutor<TransactionHistory> {
    @Transactional
    @Modifying
    @Query("UPDATE TransactionHistory th SET th.account.id = NULL WHERE th.account.id = :accountId")
    void updateAllByAccountId(@Param("accountId") Long accountId);
    @Transactional
    @Modifying
    void deleteAllByAccountId(Long id);
}
