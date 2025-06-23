package com.tenant.storage.tenant.repository;

import com.tenant.storage.tenant.model.GroupPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface GroupPermissionRepository extends JpaRepository<GroupPermission, Long>, JpaSpecificationExecutor<GroupPermission> {
    @Transactional
    void deleteAllByGroupId(Long id);
    List<GroupPermission> findAllByGroupId(Long id);
    @Query("SELECT ep.permissionId FROM GroupPermission ep WHERE ep.group.id = :id")
    List<Long> findAllPermissionIdsByGroupId(Long id);
}