package com.msa.scheduler;

import com.msa.cache.CacheService;
import com.msa.cloudinary.CloudinaryService;
import com.msa.constant.SecurityConstant;
import com.msa.storage.master.repository.DbConfigRepository;
import com.msa.multitenancy.tenant.TenantService;
import com.msa.storage.master.repository.SessionRepository;
import com.msa.storage.master.repository.UserRepository;
import com.msa.utils.DateUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
@Slf4j
public class CleanupDbConfigScheduler {
    @Autowired
    private DbConfigRepository dbConfigRepository;
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private TenantService tenantService;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CacheService cacheService;

    @Scheduled(cron = "0 0 0 * * *", zone = SecurityConstant.TIMEZONE_UTC)
    private void startScheduler() {
        Date expiredDate = DateUtils.getExpiredDate(SecurityConstant.DAYS_TO_EXPIRED);
        cleanupSession(expiredDate);
    }

    private void cleanupSession(Date expiredDate) {
        sessionRepository.deleteAllByAccessTimeBefore(expiredDate);
        log.error(">>> Cleanup expired sessions");
    }
}