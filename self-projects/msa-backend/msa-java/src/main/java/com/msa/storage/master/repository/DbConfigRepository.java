package com.msa.storage.master.repository;

import com.msa.storage.master.model.DbConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DbConfigRepository extends JpaRepository<DbConfig, Long>, JpaSpecificationExecutor<DbConfig> {
    Optional<DbConfig> findFirstByUsername(String name);

    @Query("SELECT db.username FROM DbConfig db")
    List<String> findAllUsername();
}
