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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class NotificationScheduler {
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
            if (List.of(AppConstant.SCHEDULE_KIND_DAYS, AppConstant.SCHEDULE_KIND_MONTHS).contains(schedule.getKind())) {
                String token = encryptionService.serverEncrypt(ZipUtils.zipString(String.join(";", List.of(schedule.getId().toString(), new Date().toString()))));
                String clientToken = encryptionService.clientEncrypt(ZipUtils.zipString(String.join(";", List.of(tenantName, token))));
                String link = clientDomain + "/check-schedule/" + URLEncoder.encode(clientToken, StandardCharsets.UTF_8);
                dto.setLink(link);
            }
            mailService.sendScheduleNotification(dto);
        }
    }

    @Scheduled(cron = "0 * * * * *")
    public void processNotifications() {
        LocalDateTime now = DateUtils.getCurrentDateTime(SecurityConstant.TIMEZONE_VIETNAM);
        LocalDate today = now.toLocalDate();
        LocalTime currentTime = now.toLocalTime().withSecond(0).withNano(0);
        List<String> tenants = dbConfigRepository.findAllUsername();
        String currentDateStr = DateUtils.formatDate(today, AppConstant.DATE_FORMAT);
        for (String tenant : tenants) {
            TenantDBContext.setCurrentTenant(tenant);
            List<Schedule> schedules = scheduleRepository.findAll();
            for (Schedule schedule : schedules) {
                if (shouldSend(schedule, today, currentTime)) {
                    handleSendEmail(tenant, schedule, currentDateStr);
                }
            }
        }
    }

    public boolean shouldSend(Schedule schedule, LocalDate today, LocalTime currentTime) {
        try {
            LocalTime scheduleTime = LocalTime.parse(schedule.getTime());
            if (!currentTime.equals(scheduleTime)) {
                return false;
            }
            String checkedDateStr = schedule.getCheckedDate();
            Integer kind = schedule.getKind();
            int amount = schedule.getAmount();
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
}
