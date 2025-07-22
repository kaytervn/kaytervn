package com.msa.storage.master.repository;

import com.msa.storage.master.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findFirstByUsername(String username);

    Optional<User> findFirstByEmail(String email);

    Boolean existsByEmail(String email);

    Boolean existsByEmailAndIdNot(String email, Long id);

    Boolean existsByUsername(String username);

    Boolean existsByGroupId(Long id);

    Optional<User> findFirstByIdAndKind(Long id, Integer kind);

    Optional<User> findFirstByIdAndIsSuperAdminAndIdNot(Long id, Boolean isSuperAdmin, Long idNot);

    List<User> findAllByGroupId(Long id);

    List<User> findAllByStatus(Integer status);

    @Modifying
    @Transactional
    @Query("UPDATE User tb SET tb.status = :status WHERE tb.status = 1 AND tb.isSuperAdmin = false")
    void updateAllActiveUserStatus(@Param("status") Integer status);
}