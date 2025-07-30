package com.msa.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.msa.constant.AppConstant;
import com.msa.constant.SecurityConstant;
import com.msa.form.json.BasicObject;
import com.msa.storage.tenant.model.Schedule;
import com.msa.storage.tenant.repository.ScheduleRepository;
import com.msa.utils.DateUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BasicApiService {
    @Autowired
    private OTPService masterOTPService;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private ScheduleRepository scheduleRepository;

    public String getOTPForgetPassword() {
        return masterOTPService.generate(4);
    }

    public List<BasicObject> extractListBasicJson(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<>() {
            });
        } catch (Exception e) {
            return null;
        }
    }

    public Map<String, String> extractMapNameNote(String json) {
        try {
            List<BasicObject> list = extractListBasicJson(json);
            return list.stream()
                    .filter(obj -> StringUtils.isNotBlank(obj.getName()))
                    .collect(Collectors.toMap(BasicObject::getName, obj ->
                            StringUtils.isNotBlank(obj.getNote()) ? obj.getNote() : obj.getName()
                    ));
        } catch (Exception e) {
            return Collections.emptyMap();
        }
    }

    public void updateCheckedDate(Schedule schedule) {
        LocalDate today = DateUtils.getCurrentDateTime(SecurityConstant.TIMEZONE_VIETNAM).toLocalDate();
        if (List.of(AppConstant.SCHEDULE_KIND_DAYS, AppConstant.SCHEDULE_KIND_MONTHS).contains(schedule.getKind())) {
            schedule.setCheckedDate(DateUtils.formatDate(today, AppConstant.DATE_FORMAT));
            schedule.setDueDate(calculateDueDate(schedule));
            scheduleRepository.save(schedule);
        } else if (AppConstant.SCHEDULE_KIND_DAY_MONTH.equals(schedule.getKind())) {
            schedule.setCheckedDate(DateUtils.formatDate(today, AppConstant.DAY_MONTH_FORMAT));
            schedule.setDueDate(calculateDueDate(schedule));
        }
        schedule.setIsSent(false);
        scheduleRepository.save(schedule);
    }

    public Date calculateDueDate(Schedule schedule) {
        try {
            ZoneId zoneVN = ZoneId.of(SecurityConstant.TIMEZONE_VIETNAM);
            LocalDateTime now = LocalDateTime.now(zoneVN);
            LocalDate today = now.toLocalDate();

            String timeStr = schedule.getTime();
            LocalTime time = LocalTime.parse(timeStr);
            String checkedDateStr = schedule.getCheckedDate();
            Integer kind = schedule.getKind();
            Integer amount = schedule.getAmount();

            if (AppConstant.SCHEDULE_KIND_DAYS.equals(kind)) {
                LocalDate startDate = DateUtils.parseDate(checkedDateStr, AppConstant.DATE_FORMAT);
                LocalDate nextDate = startDate;
                while (!nextDate.isAfter(today)) {
                    nextDate = nextDate.plusDays(amount);
                }
                return Date.from(LocalDateTime.of(nextDate, time).atZone(zoneVN).toInstant());

            } else if (AppConstant.SCHEDULE_KIND_MONTHS.equals(kind)) {
                LocalDate startDate = DateUtils.parseDate(checkedDateStr, AppConstant.DATE_FORMAT);
                LocalDate nextDate = startDate;
                while (!nextDate.isAfter(today)) {
                    nextDate = DateUtils.addMonthsSafe(nextDate, amount);
                }
                return Date.from(LocalDateTime.of(nextDate, time).atZone(zoneVN).toInstant());

            } else if (AppConstant.SCHEDULE_KIND_DAY_MONTH.equals(kind)) {
                String targetDayMonth = checkedDateStr;
                LocalDate nextDate = today;
                for (int i = 0; i <= 365; i++) {
                    String dayMonthStr = DateUtils.formatDate(nextDate, AppConstant.DAY_MONTH_FORMAT);
                    if (targetDayMonth.equals(dayMonthStr)) {
                        LocalDateTime scheduledDateTime = LocalDateTime.of(nextDate, time);
                        if (scheduledDateTime.isAfter(now)) {
                            return Date.from(scheduledDateTime.atZone(zoneVN).toInstant());
                        } else {
                            LocalDate nextYearDate = LocalDate.of(nextDate.getYear() + 1, nextDate.getMonth(), nextDate.getDayOfMonth());
                            return Date.from(LocalDateTime.of(nextYearDate, time).atZone(zoneVN).toInstant());
                        }
                    }
                    nextDate = nextDate.plusDays(1);
                }

            }
            LocalDate exactDate = DateUtils.parseDate(checkedDateStr, AppConstant.DATE_FORMAT);
            return Date.from(LocalDateTime.of(exactDate, time).atZone(zoneVN).toInstant());
        } catch (Exception e) {
            return null;
        }
    }
}