package com.msa.storage.tenant.repository;

import com.msa.storage.tenant.model.Platform;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface PlatformRepository extends JpaRepository<Platform, Long>, JpaSpecificationExecutor<Platform> {
    Boolean existsByNameAndCreatedBy(String name, String createdBy);

    Boolean existsByNameAndIdNotAndCreatedBy(String name, Long id, String createdBy);

    @Modifying
    @Transactional
    @Query("UPDATE Platform p SET p.totalAccounts = :count WHERE p.id = :id AND p.createdBy = :createdBy")
    void updateTotalAccountsAndCreatedBy(@Param("id") Long id, @Param("count") Integer count, @Param("createdBy") String createdBy);

    Optional<Platform> findFirstByIdAndCreatedBy(Long id, String createdBy);
}
