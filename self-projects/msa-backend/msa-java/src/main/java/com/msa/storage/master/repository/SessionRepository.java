package com.msa.storage.master.repository;

import com.msa.storage.master.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long>, JpaSpecificationExecutor<Session> {
    Optional<Session> findFirstBySessionKey(String key);

    List<Session> findAllByAccessTimeAfter(Date exp);

    @Transactional
    void deleteAllByAccessTimeBefore(Date exp);
}