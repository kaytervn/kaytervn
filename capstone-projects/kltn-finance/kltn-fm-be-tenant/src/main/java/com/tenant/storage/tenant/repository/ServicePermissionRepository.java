package com.tenant.storage.tenant.repository;

import com.tenant.storage.tenant.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ServicePermissionRepository extends JpaRepository<ServicePermission, Long>, JpaSpecificationExecutor<ServicePermission> {
    Optional<ServicePermission> findFirstByAccountIdAndServiceId(Long accountId, Long serviceId);
    Optional<ServicePermission> findFirstByAccountIdAndServiceGroupId(Long accountId, Long serviceGroupId);
}
