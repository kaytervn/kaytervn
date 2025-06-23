package com.tenant.storage.tenant.repository;

import com.tenant.storage.tenant.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {
    @Transactional
    @Modifying
    @Query("UPDATE Transaction t SET t.category.id = NULL WHERE t.category.id = :categoryId")
    void updateAllByCategoryId(@Param("categoryId") Long categoryId);
    @Transactional
    @Modifying
    @Query("UPDATE Transaction t SET t.transactionGroup.id = NULL WHERE t.transactionGroup.id = :transactionGroupId")
    void updateAllByTransactionGroupId(@Param("transactionGroupId") Long transactionGroupId);
    List<Transaction> findAllByPaymentPeriodId(Long paymentPeriodId);
    @Transactional
    @Modifying
    @Query("UPDATE Transaction t SET t.paymentPeriod.id = :paymentPeriodId WHERE t.paymentPeriod.id = NULL AND t.state = :state AND t.createdDate >= :startDate AND t.createdDate <= :endDate")
    void updateAllByStateAndCreatedDate(@Param("paymentPeriodId") Long paymentPeriodId, @Param("state") Integer state, @Param("startDate") Date startDate, @Param("endDate") Date endDate);
    @Transactional
    @Modifying
    @Query("UPDATE Transaction t SET t.state = :state WHERE t.paymentPeriod.id = :paymentPeriodId")
    void updateStateAllByPaymentPeriodId(@Param("paymentPeriodId") Long paymentPeriodId, @Param("state") Integer state);
    @Transactional
    @Modifying
    @Query("UPDATE Transaction t SET t.paymentPeriod.id = NULL WHERE t.paymentPeriod.id = :paymentPeriodId")
    void updateAllByPaymentPeriodId(@Param("paymentPeriodId") Long paymentPeriodId);
    @Transactional
    @Modifying
    @Query("UPDATE Transaction t SET t.tag.id = NULL WHERE t.tag.id = :tagId")
    void updateAllByTagId(@Param("tagId") Long tagId);
    Boolean existsByTransactionGroupId(Long id);
}
