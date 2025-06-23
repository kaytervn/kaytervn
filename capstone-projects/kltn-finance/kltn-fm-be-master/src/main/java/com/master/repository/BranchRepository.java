package com.master.repository;

import com.master.model.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BranchRepository extends JpaRepository<Branch, Long>, JpaSpecificationExecutor<Branch> {
    @Query("SELECT b FROM AccountBranch ab JOIN ab.branch b WHERE ab.account.id = :id")
    List<Branch> findAllByAccountId(@Param("id") Long id);
    @Query("SELECT b FROM Branch b JOIN AccountBranch ab ON ab.branch.id = b.id WHERE b.id = :branchId AND ab.account.id = :accountId")
    Optional<Branch> findByIdAndAccountId(@Param("branchId") Long branchId, @Param("accountId") Long accountId);
}