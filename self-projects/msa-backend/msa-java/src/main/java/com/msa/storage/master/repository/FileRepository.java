package com.msa.storage.master.repository;

import com.msa.storage.master.model.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

public interface FileRepository extends JpaRepository<File, Long>, JpaSpecificationExecutor<File> {
    @Transactional
    void deleteAllByUrl(String url);

    List<File> findAllByCreatedDateBefore(Date expiryTime);
}