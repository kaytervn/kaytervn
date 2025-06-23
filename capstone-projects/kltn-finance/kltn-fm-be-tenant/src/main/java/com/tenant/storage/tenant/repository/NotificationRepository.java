package com.tenant.storage.tenant.repository;

import com.tenant.storage.tenant.model.*;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

public interface NotificationRepository extends JpaRepository<Notification, Long>, JpaSpecificationExecutor<Notification> {
    @Transactional
    @Modifying
    @Query("UPDATE Notification SET state = :state WHERE accountId = :accountId")
    void changeStateAllByAccountId(@Param("accountId") Long accountId, @Param("state") Integer state);
    @Transactional
    void deleteAllByAccountId(Long accountId);
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM db_fn_notification n WHERE n.created_date <= :dateBeforeDays ", nativeQuery = true)
    void deleteAllNotificationExpired(@Param("dateBeforeDays") Date dateBeforeDays);
    Long countByAccountIdAndStateAndStatus(Long userId, Integer state, Integer status);
}
