package com.tenant.storage.tenant.repository;

import com.tenant.storage.tenant.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    @Transactional
    @Modifying
    @Query("UPDATE Task t SET t.project.id = NULL WHERE t.project.id = :projectId")
    void updateAllByProjectId(@Param("projectId") Long projectId);
    @Query("SELECT COUNT(t) FROM Task t WHERE t.parent.id = :parentId")
    Integer countTotalChildrenByParentId(@Param("parentId") Long parentId);
    @Transactional
    @Modifying
    @Query("UPDATE Task t SET t.project.id = :projectId WHERE t.parent.id = :parentId")
    void updateAllByParentId(@Param("projectId") Long projectId, @Param("parentId") Long parentId);
    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId AND t.parent.id IS NULL")
    Integer countTotalTasksByProjectId(@Param("projectId") Long projectId);
    Boolean existsByProjectId(Long id);
}