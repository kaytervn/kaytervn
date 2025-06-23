package com.master.repository;

import com.master.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long>, JpaSpecificationExecutor<Account> {
    Optional<Account> findFirstByUsername(String username);
    Optional<Account> findFirstByEmail(String email);
    Optional<Account> findFirstByPhone(String phone);
    Boolean existsByEmail(String email);
    Boolean existsByGroupId(Long id);
    Optional<Account> findFirstByUsernameAndKind(String username, Integer kind);
    Optional<Account> findFirstByIdAndKind(Long id, Integer kind);
    List<Account> findAllByGroupId(Long id);
    @Modifying
    @Transactional
    @Query("DELETE FROM Account a WHERE a.id = :id AND a.kind = 2")
    void deleteAllByCustomerId(@Param("id") Long id);
}
