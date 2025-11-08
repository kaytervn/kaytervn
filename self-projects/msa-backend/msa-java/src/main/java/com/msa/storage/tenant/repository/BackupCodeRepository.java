package com.msa.storage.tenant.repository;

import com.msa.storage.tenant.model.BackupCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface BackupCodeRepository extends JpaRepository<BackupCode, Long>, JpaSpecificationExecutor<BackupCode> {
    @Transactional
    void deleteAllByAccountIdAndCreatedBy(Long accountId, String createdBy);

    Boolean existsByAccountIdAndCodeAndCreatedBy(Long accountId, String code, String createdBy);

    Integer countByAccountIdAndCreatedBy(Long id, String createdBy);

    Optional<BackupCode> findFirstByIdAndCreatedBy(Long id, String createdBy);
}