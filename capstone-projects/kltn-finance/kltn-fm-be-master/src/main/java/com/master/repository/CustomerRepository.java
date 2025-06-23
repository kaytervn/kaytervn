package com.master.repository;

import com.master.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {
    @Transactional
    void deleteAllByAccountId(Long accountId);
    Optional<Customer> findFirstByAccountId(Long accountId);
    Boolean existsByBranchId(Long id);
}
