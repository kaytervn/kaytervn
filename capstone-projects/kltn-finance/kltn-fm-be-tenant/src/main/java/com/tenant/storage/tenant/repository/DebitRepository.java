package com.tenant.storage.tenant.repository;

import com.tenant.storage.tenant.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface DebitRepository extends JpaRepository<Debit, Long>, JpaSpecificationExecutor<Debit> {
    @Transactional
    @Modifying
    @Query("UPDATE Debit d SET d.category.id = NULL WHERE d.category.id = :categoryId")
    void updateAllByCategoryId(@Param("categoryId") Long categoryId);
    @Transactional
    @Modifying
    @Query("UPDATE Debit d SET d.transactionGroup.id = NULL WHERE d.transactionGroup.id = :transactionGroupId")
    void updateAllByTransactionGroupId(@Param("transactionGroupId") Long transactionGroupId);
    @Transactional
    void deleteAllByTransactionId(Long transactionId);
    Optional<Debit> findFirstByTransactionId(Long transactionId);
    @Transactional
    @Modifying
    @Query("UPDATE Debit d SET d.tag.id = NULL WHERE d.tag.id = :tagId")
    void updateAllByTagId(@Param("tagId") Long tagId);
    Boolean existsByTransactionGroupId(Long id);
}