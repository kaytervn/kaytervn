package com.msa.storage.tenant.repository;

import com.msa.storage.tenant.model.Bank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface BankRepository extends JpaRepository<Bank, Long>, JpaSpecificationExecutor<Bank> {
    Boolean existsByUsernameAndTagIdAndCreatedBy(String username, Long tagId, String createdBy);

    Boolean existsByUsernameAndTagIdAndIdNotAndCreatedBy(String username, Long tagId, Long id, String createdBy);

    Boolean existsByTagIdAndCreatedBy(Long tagId, String createdBy);

    Optional<Bank> findFirstByIdAndCreatedBy(Long id, String createdBy);
}
