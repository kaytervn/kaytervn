package com.tenant.storage.tenant.repository;

import com.tenant.dto.service.ServiceReminderDto;
import com.tenant.storage.tenant.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ServiceRepository extends JpaRepository<Service, Long>, JpaSpecificationExecutor<Service> {
    Optional<Service> findFirstByNameAndKind(String name, Integer kind);
    @Transactional
    @Modifying
    @Query("UPDATE Service s SET s.serviceGroup.id = NULL WHERE s.serviceGroup.id = :serviceGroupId")
    void updateAllByServiceGroupId(@Param("serviceGroupId") Long serviceGroupId);
    @Query("SELECT DISTINCT ugn.account.id AS accountId, s.id AS serviceId, s.name AS serviceName, FUNCTION('DATEDIFF', s.expirationDate, CURRENT_DATE) AS numberOfDueDays " +
            "FROM Service s LEFT JOIN ServiceSchedule ss ON s.id = ss.service.id " +
            "LEFT JOIN ServiceNotificationGroup sng ON s.id = sng.service.id " +
            "LEFT JOIN UserGroupNotification ugn ON sng.notificationGroup.id = ugn.notificationGroup.id " +
            "WHERE FUNCTION('DATEDIFF', s.expirationDate, CURRENT_DATE) =  " +
            "IFNULL(ss.numberOfDueDays, FUNCTION('DATEDIFF', s.expirationDate, CURRENT_DATE))")
    List<ServiceReminderDto> getListServiceReminderDto();
    @Transactional
    @Modifying
    @Query("UPDATE Service s SET s.tag.id = NULL WHERE s.tag.id = :tagId")
    void updateAllByTagId(@Param("tagId") Long tagId);
    Boolean existsByServiceGroupId(Long id);
}
