package com.msa.storage.master.repository;

import com.msa.storage.master.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface GroupRepository extends JpaRepository<Group, Long>, JpaSpecificationExecutor<Group> {
    Optional<Group> findFirstByIdAndIsSystem(Long id, Boolean isSystem);

    Boolean existsByName(String name);

    Boolean existsByNameAndIdNot(String name, Long id);

    Optional<Group> findFirstByIdAndKindAndIsSystem(Long id, Integer kind, Boolean isSystem);
}