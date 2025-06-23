package com.tenant.storage.tenant.repository;

import com.tenant.storage.tenant.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface TransactionPermissionRepository extends JpaRepository<TransactionPermission, Long>, JpaSpecificationExecutor<TransactionPermission> {
    Optional<TransactionPermission> findFirstByAccountIdAndTransactionId(Long accountId, Long transactionId);
    Optional<TransactionPermission> findFirstByAccountIdAndTransactionGroupId(Long accountId, Long transactionGroupId);
}
