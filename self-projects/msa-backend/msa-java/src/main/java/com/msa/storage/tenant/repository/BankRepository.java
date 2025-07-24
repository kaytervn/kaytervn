package com.msa.storage.tenant.repository;

import com.msa.storage.tenant.model.Bank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BankRepository extends JpaRepository<Bank, Long>, JpaSpecificationExecutor<Bank> {
    Boolean existsByUsernameAndTagId(String username, Long tagId);

    Boolean existsByUsernameAndTagIdAndIdNot(String username, Long tagId, Long id);

    Boolean existsByTagId(Long tagId);
}
