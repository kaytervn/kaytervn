package com.msa.storage.tenant.repository;

import com.msa.storage.tenant.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, Long>, JpaSpecificationExecutor<Contact> {
    Boolean existsByNameAndCreatedBy(String name, String createdBy);

    Boolean existsByPhoneAndCreatedBy(String phone, String createdBy);

    Boolean existsByNameAndIdNotAndCreatedBy(String name, Long id, String createdBy);

    Boolean existsByPhoneAndIdNotAndCreatedBy(String phone, Long id, String createdBy);

    @Modifying
    @Transactional
    @Query("UPDATE Contact tb SET tb.tag = NULL WHERE tb.tag.id = :id AND tb.createdBy = :createdBy")
    void updateTagIdNullAndCreatedBy(@Param("id") Long id, @Param("createdBy") String createdBy);

    Optional<Contact> findFirstByIdAndCreatedBy(Long id, String createdBy);
}
