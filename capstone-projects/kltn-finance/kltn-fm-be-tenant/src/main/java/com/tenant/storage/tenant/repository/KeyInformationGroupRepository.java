package com.tenant.storage.tenant.repository;

import com.tenant.storage.tenant.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface KeyInformationGroupRepository extends JpaRepository<KeyInformationGroup, Long>, JpaSpecificationExecutor<KeyInformationGroup> {
    Optional<KeyInformationGroup> findFirstByName(String name);
}

