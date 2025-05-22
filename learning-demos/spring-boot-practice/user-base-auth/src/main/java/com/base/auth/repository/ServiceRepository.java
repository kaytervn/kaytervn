package com.base.auth.repository;

import com.base.auth.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Long>, JpaSpecificationExecutor<Service> {

    @Transactional
    @Modifying(clearAutomatically = true)
    void deleteAllByAccountId(Long id);
    Service findFirstByAccountId(Long accountId);

    Service findFirstByTenantId(String name);

    @Query("SELECT r" +
            " FROM Service r" +
            " WHERE r.account.id = :accountId")
    List<Service> findAllByShopId(@Param("accountId") Long accountId);
}
