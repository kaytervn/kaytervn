package com.base.auth.repository;

import com.base.auth.model.Nation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface NationRepository extends JpaRepository<Nation, Long>, JpaSpecificationExecutor<Nation> {

    @Query("select n.id from Nation n where n.parent.id in :parentId")
    List<Long> getAllNationIdByParentId(@Param("parentId") List<Long> parentId);

    @Transactional
    @Modifying
    @Query("delete FROM Nation n WHERE n.parent.id in :parentIds")
    void deleteAllByParentIdInList(@Param("parentIds") List<Long> parentIds);

    Boolean existsByParentId(Long parentId);
}
