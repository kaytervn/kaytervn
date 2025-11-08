package com.msa.storage.tenant.repository;

import com.msa.storage.tenant.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long>, JpaSpecificationExecutor<Account> {
    Boolean existsByPlatformIdAndCreatedBy(Long id, String createdBy);

    Boolean existsByParentIdAndCreatedBy(Long id, String createdBy);

    Boolean existsByUsernameAndPlatformIdAndCreatedBy(String username, Long id, String createdBy);

    Boolean existsByParentIdAndPlatformIdAndCreatedBy(Long parentId, Long platformId, String createdBy);

    Integer countByParentIdAndCreatedBy(Long id, String createdBy);

    Integer countByPlatformIdAndCreatedBy(Long id, String createdBy);

    @Modifying
    @Transactional
    @Query("UPDATE Account tb SET tb.totalChildren = :count WHERE tb.id = :id AND tb.createdBy = :createdBy")
    void updateTotalChildrenAndCreatedBy(@Param("id") Long id, @Param("count") Integer count, @Param("createdBy") String createdBy);

    @Modifying
    @Transactional
    @Query("UPDATE Account tb SET tb.totalBackupCodes = :count WHERE tb.id = :id AND tb.createdBy = :createdBy")
    void updateTotalBackupCodesAndCreatedBy(@Param("id") Long id, @Param("count") Integer count, @Param("createdBy") String createdBy);

    @Modifying
    @Transactional
    @Query("UPDATE Account tb SET tb.tag = NULL WHERE tb.tag.id = :id AND tb.createdBy = :createdBy")
    void updateTagIdNullAndCreatedBy(@Param("id") Long id, @Param("createdBy") String createdBy);

    Optional<Account> findFirstByIdAndKindAndCreatedBy(Long id, Integer kind, String createdBy);

    Optional<Account> findFirstByIdAndCreatedBy(Long id, String createdBy);
}