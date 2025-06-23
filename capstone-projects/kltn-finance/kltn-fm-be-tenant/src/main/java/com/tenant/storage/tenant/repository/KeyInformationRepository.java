package com.tenant.storage.tenant.repository;

import com.tenant.storage.tenant.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface KeyInformationRepository extends JpaRepository<KeyInformation, Long>, JpaSpecificationExecutor<KeyInformation> {
    @Transactional
    @Modifying
    @Query("UPDATE KeyInformation ki SET ki.account.id = NULL WHERE ki.account.id = :accountId")
    void updateAllByAccountId(@Param("accountId") Long accountId);
    @Transactional
    @Modifying
    @Query("UPDATE KeyInformation ki SET ki.keyInformationGroup.id = NULL WHERE ki.keyInformationGroup.id = :keyInformationGroupId")
    void updateAllByKeyInformationGroupId(@Param("keyInformationGroupId") Long keyInformationGroupId);
    @Transactional
    @Modifying
    @Query("UPDATE KeyInformation ki SET ki.organization.id = NULL WHERE ki.organization.id = :organizationId")
    void updateAllByOrganizationId(@Param("organizationId") Long organizationId);
    @Transactional
    @Modifying
    @Query("UPDATE KeyInformation k SET k.tag.id = NULL WHERE k.tag.id = :tagId")
    void updateAllByTagId(@Param("tagId") Long tagId);
    Boolean existsByKeyInformationGroupId(Long id);
}
