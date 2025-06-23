package com.master.repository;

import com.master.model.AccountBranch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.transaction.annotation.Transactional;

public interface AccountBranchRepository extends JpaRepository<AccountBranch, Long>, JpaSpecificationExecutor<AccountBranch> {
    @Transactional
    void deleteAllByAccountId(Long accountId);
    Boolean existsByAccountIdAndBranchId(Long accountId, Long branchId);
    Boolean existsByBranchId(Long id);
}