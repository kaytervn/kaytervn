package com.msa.storage.tenant.repository;

import com.msa.storage.tenant.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface ContactRepository extends JpaRepository<Contact, Long>, JpaSpecificationExecutor<Contact> {
    Boolean existsByName(String name);

    Boolean existsByPhone(String phone);

    Boolean existsByNameAndIdNot(String name, Long id);

    Boolean existsByPhoneAndIdNot(String phone, Long id);

    @Modifying
    @Transactional
    @Query("UPDATE Contact tb SET tb.tag = NULL WHERE tb.tag.id = :id")
    void updateTagIdNull(@Param("id") Long id);
}
