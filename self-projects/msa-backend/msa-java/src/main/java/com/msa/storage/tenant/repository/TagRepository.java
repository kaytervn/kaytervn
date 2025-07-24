package com.msa.storage.tenant.repository;

import com.msa.storage.tenant.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long>, JpaSpecificationExecutor<Tag> {
    Boolean existsByNameAndKind(String name, Integer kind);

    Boolean existsByNameAndKindAndIdNot(String name, Integer kind, Long id);

    Optional<Tag> findFirstByIdAndKind(Long id, Integer kind);
}