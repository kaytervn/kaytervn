package com.master.repository;

import com.master.model.ServerProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ServerProviderRepository extends JpaRepository<ServerProvider, Long>, JpaSpecificationExecutor<ServerProvider> {
    Optional<ServerProvider> findFirstByUrl(String url);
}
