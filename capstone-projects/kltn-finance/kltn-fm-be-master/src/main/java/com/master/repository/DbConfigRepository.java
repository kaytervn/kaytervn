package com.master.repository;

import com.master.model.DbConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DbConfigRepository extends JpaRepository<DbConfig, Long>, JpaSpecificationExecutor<DbConfig> {
    Optional<DbConfig> findFirstByNameAndInitialize(String name, Boolean initialize);
    boolean existsByServerProviderId(Long serverProviderId);
    Integer countByServerProviderId(Long serverProviderId);
    @Query("SELECT db.username FROM DbConfig db")
    List<String> findAllUserName();
    @Query("SELECT d" +
            " FROM DbConfig d" +
            " JOIN Location l ON d.location = l" +
            " WHERE l.id = :locationId")
    DbConfig findByLocationId(@Param("locationId") Long locationId);
}