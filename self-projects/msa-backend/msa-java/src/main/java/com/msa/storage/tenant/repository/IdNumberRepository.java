package com.msa.storage.tenant.repository;

import com.msa.storage.tenant.model.IdNumber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface IdNumberRepository extends JpaRepository<IdNumber, Long>, JpaSpecificationExecutor<IdNumber> {
    Boolean existsByNameAndCreatedBy(String name, String createdBy);

    Boolean existsByCodeAndCreatedBy(String code, String createdBy);

    Boolean existsByNameAndIdNotAndCreatedBy(String name, Long id, String createdBy);

    Boolean existsByCodeAndIdNotAndCreatedBy(String code, Long id, String createdBy);

    @Modifying
    @Transactional
    @Query("UPDATE IdNumber tb SET tb.tag = NULL WHERE tb.tag.id = :id AND tb.createdBy = :createdBy")
    void updateTagIdNullAndCreatedBy(@Param("id") Long id, @Param("createdBy") String createdBy);

    Optional<IdNumber> findFirstByIdAndCreatedBy(Long id, String createdBy);
}
