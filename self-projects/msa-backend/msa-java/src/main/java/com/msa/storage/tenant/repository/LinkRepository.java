package com.msa.storage.tenant.repository;

import com.msa.storage.tenant.model.Link;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface LinkRepository extends JpaRepository<Link, Long>, JpaSpecificationExecutor<Link> {
    Boolean existsByName(String name);

    Boolean existsByLink(String value);

    Boolean existsByNameAndIdNot(String name, Long id);

    Boolean existsByLinkAndIdNot(String value, Long id);

    @Modifying
    @Transactional
    @Query("UPDATE Link tb SET tb.tag = NULL WHERE tb.tag.id = :id")
    void updateTagIdNull(@Param("id") Long id);
}