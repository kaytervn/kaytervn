package com.msa.storage.tenant.repository;

import com.msa.storage.tenant.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface AccountRepository extends JpaRepository<Account, Long>, JpaSpecificationExecutor<Account> {
    Boolean existsByPlatformId(Long id);

    Boolean existsByParentId(Long id);

    Boolean existsByUsernameAndPlatformId(String username, Long id);

    Boolean existsByParentIdAndPlatformId(Long parentId, Long platformId);

    Integer countByParentId(Long id);

    Integer countByPlatformId(Long id);

    @Modifying
    @Transactional
    @Query("UPDATE Account tb SET tb.totalChildren = :count WHERE tb.id = :id")
    void updateTotalChildren(@Param("id") Long id, @Param("count") Integer count);

    @Modifying
    @Transactional
    @Query("UPDATE Account tb SET tb.totalBackupCodes = :count WHERE tb.id = :id")
    void updateTotalBackupCodes(@Param("id") Long id, @Param("count") Integer count);

    @Modifying
    @Transactional
    @Query("UPDATE Account tb SET tb.tag = NULL WHERE tb.tag.id = :id")
    void updateTagIdNull(@Param("id") Long id);
}