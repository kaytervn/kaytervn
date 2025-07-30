package com.msa.scheduler;

import com.msa.constant.AppConstant;
import com.msa.constant.SecurityConstant;
import com.msa.dto.schedule.ScheduleMailDto;
import com.msa.multitenancy.TenantDBContext;
import com.msa.service.BasicApiService;
import com.msa.service.encryption.EncryptionService;
import com.msa.service.mail.MailServiceImpl;
import com.msa.storage.master.repository.DbConfigRepository;
import com.msa.storage.tenant.model.Schedule;
import com.msa.storage.tenant.repository.ScheduleRepository;
import com.msa.utils.DateUtils;
import com.msa.utils.ZipUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class NotificationScheduler {
    private static final Integer ALLOWED_MINUTES = 2;
    @Autowired
    private ScheduleRepository scheduleRepository;
    @Autowired
    private DbConfigRepository dbConfigRepository;
    @Autowired
    private BasicApiService basicApiService;
    @Autowired
    private EncryptionService encryptionService;
    @Value("${app.client-domain}")
    private String clientDomain;
    @Autowired
    private MailServiceImpl mailService;

    private void handleSendEmail(String tenantName, Schedule schedule, String currentDate) {
        Map<String, String> emailsMap = basicApiService.extractMapNameNote(schedule.getEmails());
        for (Map.Entry<String, String> entry : emailsMap.entrySet()) {
            ScheduleMailDto dto = new ScheduleMailDto();
            dto.setDate(currentDate);
            dto.setToEmail(entry.getKey());
            dto.setReceiver(entry.getValue());
            dto.setTitle(schedule.getName());
            dto.setImagePath(schedule.getImagePath());
            dto.setContent(schedule.getContent());
            if (AppConstant.SCHEDULE_TYPE_AUTO_RENEW.equals(schedule.getType())) {
                basicApiService.updateCheckedDate(schedule);
            } else if (AppConstant.SCHEDULE_TYPE_MANUAL_RENEW.equals(schedule.getType()) && List.of(AppConstant.SCHEDULE_KIND_DAYS, AppConstant.SCHEDULE_KIND_MONTHS, AppConstant.SCHEDULE_KIND_DAY_MONTH).contains(schedule.getKind())) {
                String token = encryptionService.serverEncrypt(ZipUtils.zipString(String.join(";", List.of(schedule.getId().toString(), new Date().toString()))));
                String clientToken = encryptionService.clientEncrypt(ZipUtils.zipString(String.join(";", List.of(tenantName, token))));
                String link = clientDomain + "/check-schedule/" + URLEncoder.encode(clientToken, StandardCharsets.UTF_8);
                dto.setLink(link);
                schedule.setIsSent(true);
                scheduleRepository.save(schedule);
            }
            mailService.sendScheduleNotification(dto);
        }
    }

    private boolean shouldSend(Schedule schedule, LocalDate today, LocalTime currentTime) {
        try {
            LocalTime scheduleTime = LocalTime.parse(schedule.getTime());
            long diffMinutes = ChronoUnit.MINUTES.between(scheduleTime, currentTime);
            log.warn("scheduleTime: {}", scheduleTime);
            log.warn("diffMinutes: {}", diffMinutes);
            if (diffMinutes < 0 || diffMinutes > ALLOWED_MINUTES) {
                return false;
            }
            String checkedDateStr = schedule.getCheckedDate();
            Integer kind = schedule.getKind();
            Integer amount = schedule.getAmount();
            if (AppConstant.SCHEDULE_KIND_DAYS.equals(kind)) {
                LocalDate startDate = DateUtils.parseDate(checkedDateStr, AppConstant.DATE_FORMAT);
                long daysBetween = ChronoUnit.DAYS.between(startDate, today);
                return daysBetween >= 0 && daysBetween % amount == 0;
            } else if (AppConstant.SCHEDULE_KIND_MONTHS.equals(kind)) {
                LocalDate startDate = DateUtils.parseDate(checkedDateStr, AppConstant.DATE_FORMAT);
                LocalDate nextDate = startDate;
                while (!nextDate.isAfter(today)) {
                    if (nextDate.equals(today)) {
                        return true;
                    }
                    nextDate = DateUtils.addMonthsSafe(nextDate, amount);
                }
                return false;
            } else if (AppConstant.SCHEDULE_KIND_DAY_MONTH.equals(kind)) {
                return checkedDateStr.equals(DateUtils.formatDate(today, AppConstant.DAY_MONTH_FORMAT));
            } else {
                LocalDate exactDate = DateUtils.parseDate(checkedDateStr, AppConstant.DATE_FORMAT);
                return today.equals(exactDate);
            }
        } catch (Exception e) {
            log.error("shouldSend error (schedule id={}): {}", schedule.getId(), e.getMessage());
            return false;
        }
    }

    public void sendScheduleNotification() {
        ZoneId zoneVN = ZoneId.of(SecurityConstant.TIMEZONE_VIETNAM);
        LocalDateTime now = LocalDateTime.now(zoneVN);
        LocalDate today = now.toLocalDate();
        LocalTime currentTime = now.toLocalTime().withSecond(0).withNano(0);
        List<String> tenants = dbConfigRepository.findAllUsername();
        String currentDateStr = DateUtils.formatDate(today, AppConstant.DATE_FORMAT);
        Date fromDate = Date.from(today.atStartOfDay(zoneVN).toInstant());
        Date toDate = Date.from(today.atTime(23, 59, 59).atZone(zoneVN).toInstant());
        log.warn("today: {}", today);
        log.warn("currentTime: {}", currentTime);
        log.warn("currentDateStr: {}", currentDateStr);
        log.warn("fromDate: {}", fromDate);
        log.warn("toDate: {}", toDate);
        for (String tenant : tenants) {
            TenantDBContext.setCurrentTenant(tenant);
            List<Schedule> schedules = scheduleRepository.findAllDueToday(
                    false, AppConstant.SCHEDULE_TYPE_SUSPENDED, fromDate, toDate
            );
            log.warn("currentTenant: {}", tenant);
            log.warn("schedulesSize: {}", schedules.size());
            for (Schedule schedule : schedules) {
                if (shouldSend(schedule, today, currentTime)) {
                    handleSendEmail(tenant, schedule, currentDateStr);
                }
            }
        }
    }
}
