package com.msa.cache;

import com.msa.constant.AppConstant;
import com.msa.constant.SecurityConstant;
import com.msa.multitenancy.TenantDBContext;
import com.msa.storage.master.repository.DbConfigRepository;
import com.msa.storage.tenant.model.Schedule;
import com.msa.storage.tenant.repository.ScheduleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CacheService {
    @Qualifier(SecurityConstant.CACHE_TENANTS)
    @Autowired
    private Set<String> cacheTenants;
    @Qualifier(SecurityConstant.CACHE_SCHEDULES)
    @Autowired
    private ConcurrentMap<String, List<Long>> cacheSchedules;
    @Autowired
    private DbConfigRepository dbConfigRepository;
    @Autowired
    private ScheduleRepository scheduleRepository;

    public void handleCacheTenants() {
        cacheTenants.clear();
        List<String> tenants = dbConfigRepository.findAllUsername();
        cacheTenants.addAll(tenants);
        log.info("CacheTenants loaded. Size {}", tenants.size());
    }

    public void addTenant(String tenant) {
        cacheTenants.add(tenant);
    }

    public void removeTenant(String tenant) {
        cacheTenants.remove(tenant);
    }

    public List<String> getTenants() {
        return new ArrayList<>(cacheTenants);
    }

    public void handleCacheSchedules() {
        cacheSchedules.clear();
        ZoneId zoneVN = ZoneId.of(SecurityConstant.TIMEZONE_VIETNAM);
        LocalDateTime now = LocalDateTime.now(zoneVN);
        LocalDate today = now.toLocalDate();
        List<String> tenants = getTenants();
        Date fromDate = Date.from(today.atStartOfDay(zoneVN).toInstant());
        Date toDate = Date.from(today.atTime(23, 59, 59).atZone(zoneVN).toInstant());
        for (String tenant : tenants) {
            TenantDBContext.setCurrentTenant(tenant);
            List<Schedule> schedules = scheduleRepository.findAllDueToday(
                    false, AppConstant.SCHEDULE_TYPE_SUSPENDED, fromDate, toDate
            );
            List<Long> scheduleIds = schedules.stream().map(Schedule::getId).collect(Collectors.toList());
            if (!scheduleIds.isEmpty()) {
                cacheSchedules.put(tenant, scheduleIds);
            }
        }
        log.info("CacheSchedules loaded. Size {}", cacheSchedules.size());
    }

    public void removeScheduleId(Long scheduleId) {
        String tenant = TenantDBContext.getCurrentTenant();
        List<Long> scheduleIds = getScheduleIds(tenant);
        if (scheduleIds != null && scheduleIds.contains(scheduleId)) {
            scheduleIds.remove(scheduleId);
            if (scheduleIds.isEmpty()) {
                cacheSchedules.remove(tenant);
            }
        }
    }

    public void addOrRemoveSchedule(Schedule schedule) {
        if (schedule.getIsSent() || AppConstant.SCHEDULE_TYPE_SUSPENDED.equals(schedule.getType())) {
            removeScheduleId(schedule.getId());
            return;
        }
        String tenant = TenantDBContext.getCurrentTenant();
        Long scheduleId = schedule.getId();
        Date dueDate = schedule.getDueDate();
        ZoneId zoneVN = ZoneId.of(SecurityConstant.TIMEZONE_VIETNAM);
        LocalDateTime now = LocalDateTime.now(zoneVN);
        LocalDate today = now.toLocalDate();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(23, 59, 59);
        LocalDateTime dueDateTime = dueDate.toInstant().atZone(zoneVN).toLocalDateTime();
        boolean isToday = !dueDateTime.isBefore(startOfDay) && !dueDateTime.isAfter(endOfDay);
        if (!isToday) {
            removeScheduleId(schedule.getId());
            return;
        }
        List<Long> scheduleIds = cacheSchedules.computeIfAbsent(tenant, k -> new ArrayList<>());
        if (!scheduleIds.contains(scheduleId)) {
            scheduleIds.add(scheduleId);
        }
    }

    public List<Long> getScheduleIds(String tenant) {
        return cacheSchedules.get(tenant);
    }
}
