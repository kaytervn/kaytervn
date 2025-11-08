package com.msa.storage.tenant.repository;

import com.msa.storage.tenant.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long>, JpaSpecificationExecutor<Tag> {
    Boolean existsByNameAndKindAndCreatedBy(String name, Integer kind, String createdBy);

    Boolean existsByNameAndKindAndIdNotAndCreatedBy(String name, Integer kind, Long id, String createdBy);

    Optional<Tag> findFirstByIdAndKindAndCreatedBy(Long id, Integer kind, String createdBy);

    Optional<Tag> findFirstByIdAndCreatedBy(Long id, String createdBy);
}