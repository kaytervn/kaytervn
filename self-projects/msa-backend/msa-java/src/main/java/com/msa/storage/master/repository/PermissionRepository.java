package com.msa.storage.master.repository;

import com.msa.storage.master.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface PermissionRepository extends JpaRepository<Permission, Long>, JpaSpecificationExecutor<Permission> {
    Boolean existsByNameAndNameGroup(String name, String nameGroup);

    Boolean existsByPermissionCode(String code);

    List<Permission> findAllByIdInAndKind(List<Long> ids, Integer kind);
}