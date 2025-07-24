package com.msa.scheduler;

import com.msa.cloudinary.CloudinaryService;
import com.msa.constant.SecurityConstant;
import com.msa.storage.master.model.DbConfig;
import com.msa.storage.master.model.User;
import com.msa.storage.master.repository.DbConfigRepository;
import com.msa.multitenancy.tenant.TenantService;
import com.msa.storage.master.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Component
@Slf4j
public class CleanupDbConfigScheduler {
    private final static Integer DAYS_TO_EXPIRED = 30;
    @Autowired
    private DbConfigRepository dbConfigRepository;
    @Autowired
    private TenantService tenantService;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private UserRepository userRepository;

    @Scheduled(cron = "0 0 0 * * *", zone = SecurityConstant.TIMEZONE_UTC)
    public void cleanupExpiredLockedConfigs() {
        Date expiredDate = Date.from(Instant.now().minus(DAYS_TO_EXPIRED, ChronoUnit.DAYS));
        List<DbConfig> dbConfigs = dbConfigRepository.findAllByLockedTimeBefore(expiredDate);
        for (DbConfig dbConfig : dbConfigs) {
            try {
                User user = dbConfig.getUser();
                tenantService.deleteTenantDatabase(dbConfig);
                dbConfigRepository.deleteById(dbConfig.getId());
                cloudinaryService.deleteFile(user.getAvatarPath());
                userRepository.deleteById(user.getId());
            } catch (Exception e) {
                log.error(e.getMessage());
            }
        }
    }
}