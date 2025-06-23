package com.tenant.storage.tenant.repository;

import com.tenant.storage.tenant.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {
    Optional<Project> findFirstByName(String name);
    @Transactional
    @Modifying
    @Query("UPDATE Project p SET p.organization.id = NULL WHERE p.organization.id = :organizationId")
    void updateAllByOrganizationId(@Param("organizationId") Long organizationId);
    @Transactional
    @Modifying
    @Query("UPDATE Project p SET p.tag.id = NULL WHERE p.tag.id = :tagId")
    void updateAllByTagId(@Param("tagId") Long tagId);
}