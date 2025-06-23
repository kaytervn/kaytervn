package com.tenant.storage.tenant.repository;

import com.tenant.storage.tenant.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface OrganizationPermissionRepository extends JpaRepository<OrganizationPermission, Long>, JpaSpecificationExecutor<OrganizationPermission> {
    Optional<OrganizationPermission> findFirstByAccountIdAndOrganizationId(Long accountId, Long organizationId);
}
