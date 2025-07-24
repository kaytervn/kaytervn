package com.msa.storage.tenant.repository;

import com.msa.storage.tenant.model.IdNumber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface IdNumberRepository extends JpaRepository<IdNumber, Long>, JpaSpecificationExecutor<IdNumber> {
    Boolean existsByName(String name);

    Boolean existsByCode(String code);

    Boolean existsByNameAndIdNot(String name, Long id);

    Boolean existsByCodeAndIdNot(String code, Long id);

    @Modifying
    @Transactional
    @Query("UPDATE IdNumber tb SET tb.tag = NULL WHERE tb.tag.id = :id")
    void updateTagIdNull(@Param("id") Long id);
}
