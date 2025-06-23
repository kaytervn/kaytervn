package com.master.repository;

import com.master.model.Permission;
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
public interface PermissionRepository extends JpaRepository<Permission, Long>, JpaSpecificationExecutor<Permission> {
    Optional<Permission> findFirstByNameAndKind(String name, Integer kind);
    Optional<Permission> findFirstByPermissionCodeAndKind(String permissionCode, Integer kind);
    List<Permission> findAllByIdInAndKind(List<Long> id, Integer kind);
    @Query("SELECT p.permissionCode FROM Group g JOIN g.permissions p WHERE g.kind = :kind AND p.id in :ids")
    List<String> findPermissionCodesByGroupKindAndIdIn(@Param("kind") Integer kind, @Param("ids") List<Long> ids);
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM db_mst_permission_group WHERE group_id = :groupId", nativeQuery = true)
    void deleteAllPermissionsByGroupId(@Param("groupId") Long groupId);
}
