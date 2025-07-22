package com.msa.storage.tenant.repository;

import com.msa.storage.tenant.model.BackupCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.transaction.annotation.Transactional;

public interface BackupCodeRepository extends JpaRepository<BackupCode, Long>, JpaSpecificationExecutor<BackupCode> {
    @Transactional
    void deleteAllByAccountId(Long accountId);

    Boolean existsByAccountIdAndCode(Long accountId, String code);

    Integer countByAccountId(Long id);
}