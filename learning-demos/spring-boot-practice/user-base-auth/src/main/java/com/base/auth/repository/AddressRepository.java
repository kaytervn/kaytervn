package com.base.auth.repository;

import com.base.auth.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.method.P;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address,Long>, JpaSpecificationExecutor<Address> {

    @Query("select a FROM Address a where a.province.id in :nationIds or a.ward.id in :nationIds or a.district.id in :nationIds")
    Optional<Address> findByNationIdIn(@Param("nationIds") List<Long> nationIds);
    @Transactional
    void deleteAllByUserId(Long id);

    @Transactional
    @Modifying
    @Query(value = "delete FROM db_user_base_address where user_id in (select id from db_user_base_user where account_id = :accountId)", nativeQuery = true)
    void deleteAllByAccountId(@Param("accountId") Long accountId);
}