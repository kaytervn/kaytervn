package com.msa.cache;

import com.msa.constant.SecurityConstant;
import com.msa.storage.master.model.Session;
import com.msa.storage.master.repository.SessionRepository;
import com.msa.utils.DateUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Date;
import java.util.List;

@Component
@Slf4j
public class CacheConfig {
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private CacheService cacheService;
    @Autowired
    private SessionService sessionService;

    @PostConstruct
    public void onStartup() {
        restoreSessions();
        cacheService.handleCacheTenants();
        cacheService.handleCacheSchedules();
    }

    private void restoreSessions() {
        Date expiredDate = DateUtils.getExpiredDate(SecurityConstant.DAYS_TO_EXPIRED);
        List<Session> sessions = sessionRepository.findAllByAccessTimeAfter(expiredDate);
        for (Session session : sessions) {
            sessionService.putKey(session.getSessionKey(), session.getSessionValue());
        }
        log.warn("Session restored. Size: {}", sessions.size());
    }
}
