package com.msa.storage.tenant.repository;

import com.msa.storage.tenant.model.Platform;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface PlatformRepository extends JpaRepository<Platform, Long>, JpaSpecificationExecutor<Platform> {
    Boolean existsByName(String name);

    Boolean existsByNameAndIdNot(String name, Long id);

    @Modifying
    @Transactional
    @Query("UPDATE Platform p SET p.totalAccounts = :count WHERE p.id = :id")
    void updateTotalAccounts(@Param("id") Long id, @Param("count") Integer count);
}
