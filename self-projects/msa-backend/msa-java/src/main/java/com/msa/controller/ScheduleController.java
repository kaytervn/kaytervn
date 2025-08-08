package com.msa.controller;

import com.msa.cache.CacheService;
import com.msa.constant.AppConstant;
import com.msa.constant.ErrorCode;
import com.msa.constant.SecurityConstant;
import com.msa.dto.ApiMessageDto;
import com.msa.dto.ResponseListDto;
import com.msa.dto.schedule.ScheduleDto;
import com.msa.exception.BadRequestException;
import com.msa.form.json.BasicObject;
import com.msa.form.schedule.CheckScheduleForm;
import com.msa.form.schedule.CreateScheduleForm;
import com.msa.form.schedule.UpdateScheduleForm;
import com.msa.mapper.ScheduleMapper;
import com.msa.service.BasicApiService;
import com.msa.service.encryption.EncryptionService;
import com.msa.storage.tenant.model.Schedule;
import com.msa.storage.tenant.model.Tag;
import com.msa.storage.tenant.model.criteria.ScheduleCriteria;
import com.msa.storage.tenant.repository.ScheduleRepository;
import com.msa.storage.tenant.repository.TagRepository;
import com.msa.utils.ConvertUtils;
import com.msa.utils.DateUtils;
import com.msa.utils.ZipUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Slf4j
@RestController
@RequestMapping("/v1/schedule")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ScheduleController extends ABasicController {
    @Autowired
    private ScheduleRepository scheduleRepository;
    @Autowired
    private ScheduleMapper scheduleMapper;
    @Autowired
    private TagRepository tagRepository;
    @Autowired
    private BasicApiService basicApiService;
    @Autowired
    private EncryptionService encryptionService;
    @Autowired
    private CacheService cacheService;

    private void validateCheckedDate(String checkedDateStr, Integer kind) {
        LocalDate date = null;
        if (List.of(AppConstant.SCHEDULE_KIND_DAYS, AppConstant.SCHEDULE_KIND_MONTHS, AppConstant.SCHEDULE_KIND_EXACT_DATE).contains(kind)) {
            date = DateUtils.parseDate(checkedDateStr, AppConstant.DATE_FORMAT);
        } else if (AppConstant.SCHEDULE_KIND_DAY_MONTH.equals(kind)) {
            date = DateUtils.parseDate(checkedDateStr, AppConstant.DAY_MONTH_FORMAT);
        }
        if (date == null) {
            throw new BadRequestException("checkedDate is invalid");
        }
    }

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SC_V')")
    public ApiMessageDto<ScheduleDto> get(@PathVariable("id") Long id) {
        Schedule schedule = scheduleRepository.findById(id).orElse(null);
        if (schedule == null) {
            throw new BadRequestException(ErrorCode.SCHEDULE_ERROR_NOT_FOUND, "Not found schedule");
        }
        return makeSuccessResponse(scheduleMapper.fromEntityToScheduleDto(schedule), "Get schedule success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SC_L')")
    public ApiMessageDto<ResponseListDto<List<ScheduleDto>>> list(ScheduleCriteria scheduleCriteria, Pageable pageable) {
        Page<Schedule> listSchedule = scheduleRepository.findAll(scheduleCriteria.getCriteria(), pageable);
        ResponseListDto<List<ScheduleDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(scheduleMapper.fromEntityListToScheduleDtoList(listSchedule.getContent()));
        responseListObj.setTotalPages(listSchedule.getTotalPages());
        responseListObj.setTotalElements(listSchedule.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list schedule success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<ScheduleDto>>> autoComplete(ScheduleCriteria scheduleCriteria, @PageableDefault Pageable pageable) {
        scheduleCriteria.setStatus(AppConstant.STATUS_ACTIVE);
        Page<Schedule> listSchedule = scheduleRepository.findAll(scheduleCriteria.getCriteria(), pageable);
        ResponseListDto<List<ScheduleDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(scheduleMapper.fromEntityListToScheduleDtoListAutoComplete(listSchedule.getContent()));
        responseListObj.setTotalPages(listSchedule.getTotalPages());
        responseListObj.setTotalElements(listSchedule.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list auto-complete schedule success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SC_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateScheduleForm form, BindingResult bindingResult) {
        Schedule schedule = scheduleMapper.fromCreateScheduleFormToEntity(form);
        List<BasicObject> emails = basicApiService.extractListBasicJson(form.getEmails());
        for (BasicObject obj : emails) {
            String email = obj.getName();
            String receiver = obj.getNote();
            if (!email.matches(AppConstant.EMAIL_PATTERN) || StringUtils.isBlank(receiver)) {
                throw new BadRequestException("Emails are invalid");
            }
        }
        schedule.setEmails(form.getEmails());
        if (List.of(AppConstant.SCHEDULE_KIND_DAYS, AppConstant.SCHEDULE_KIND_MONTHS).contains(form.getKind())) {
            if (form.getAmount() == null) {
                throw new BadRequestException("Amount is required");
            }
            schedule.setAmount(form.getAmount());
        }
        if (AppConstant.SCHEDULE_KIND_EXACT_DATE.equals(form.getKind())) {
            schedule.setType(null);
        } else {
            if (form.getType() == null) {
                throw new BadRequestException("Type is required");
            }
            schedule.setType(form.getType());
        }
        validateCheckedDate(form.getCheckedDate(), form.getKind());
        schedule.setCheckedDate(form.getCheckedDate());
        schedule.setCheckedDate(form.getCheckedDate());
        if (scheduleRepository.existsByName(form.getName())) {
            throw new BadRequestException(ErrorCode.SCHEDULE_ERROR_NAME_EXISTED, "Name existed");
        }
        if (form.getTagId() != null) {
            Tag tag = tagRepository.findFirstByIdAndKind(form.getTagId(), AppConstant.TAG_KIND_SCHEDULE).orElse(null);
            if (tag == null) {
                throw new BadRequestException(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            schedule.setTag(tag);
        }
        Date newDueDate = basicApiService.calculateDueDate(schedule);
        schedule.setDueDate(newDueDate);
        if (newDueDate.before(new Date())) {
            schedule.setIsSent(true);
        }
        scheduleRepository.save(schedule);
        cacheService.addOrRemoveSchedule(schedule);
        return makeSuccessResponse(null, "Create schedule success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SC_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateScheduleForm form, BindingResult bindingResult) {
        Schedule schedule = scheduleRepository.findById(form.getId()).orElse(null);
        if (schedule == null) {
            throw new BadRequestException(ErrorCode.SCHEDULE_ERROR_NOT_FOUND, "Not found schedule");
        }
        Integer oldKind = schedule.getKind();
        String oldCheckedDate = schedule.getCheckedDate();
        boolean isKindChanged = !Objects.equals(oldKind, form.getKind());
        boolean isCheckedDateChanged = !Objects.equals(oldCheckedDate, form.getCheckedDate());
        boolean isTimeChanged = !Objects.equals(schedule.getTime(), form.getTime());
        List<BasicObject> emails = basicApiService.extractListBasicJson(form.getEmails());
        for (BasicObject obj : emails) {
            String email = obj.getName();
            String receiver = obj.getNote();
            if (!email.matches(AppConstant.EMAIL_PATTERN) || StringUtils.isBlank(receiver)) {
                throw new BadRequestException("Emails is invalid");
            }
        }
        schedule.setEmails(form.getEmails());
        if (List.of(AppConstant.SCHEDULE_KIND_DAYS, AppConstant.SCHEDULE_KIND_MONTHS).contains(form.getKind())) {
            if (form.getAmount() == null) {
                throw new BadRequestException("Amount is required");
            }
            schedule.setAmount(form.getAmount());
        }
        if (AppConstant.SCHEDULE_KIND_EXACT_DATE.equals(form.getKind())) {
            schedule.setType(null);
        } else {
            if (form.getType() == null) {
                throw new BadRequestException("Type is required");
            }
            schedule.setType(form.getType());
        }
        validateCheckedDate(form.getCheckedDate(), form.getKind());
        schedule.setCheckedDate(form.getCheckedDate());
        if (scheduleRepository.existsByNameAndIdNot(form.getName(), schedule.getId())) {
            throw new BadRequestException(ErrorCode.SCHEDULE_ERROR_NAME_EXISTED, "Name existed");
        }
        scheduleMapper.fromUpdateScheduleFormToEntity(form, schedule);
        if (form.getTagId() != null) {
            Tag tag = tagRepository.findFirstByIdAndKind(form.getTagId(), AppConstant.TAG_KIND_SCHEDULE).orElse(null);
            if (tag == null) {
                throw new BadRequestException(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            schedule.setTag(tag);
        }
        Date newDueDate = basicApiService.calculateDueDate(schedule);
        boolean isDueDateChanged = !Objects.equals(newDueDate, schedule.getDueDate());
        schedule.setDueDate(newDueDate);
        if (newDueDate.before(new Date())) {
            schedule.setIsSent(true);
        } else if (isKindChanged || isCheckedDateChanged || isTimeChanged || isDueDateChanged) {
            schedule.setIsSent(false);
        }
        scheduleRepository.save(schedule);
        cacheService.addOrRemoveSchedule(schedule);
        return makeSuccessResponse(null, "Update schedule success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SC_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Schedule schedule = scheduleRepository.findById(id).orElse(null);
        if (schedule == null) {
            throw new BadRequestException(ErrorCode.SCHEDULE_ERROR_NOT_FOUND, "Not found schedule");
        }
        scheduleRepository.deleteById(id);
        cacheService.removeScheduleId(schedule.getId());
        return makeSuccessResponse(null, "Delete schedule success");
    }

    @PostMapping(value = "/check-schedule", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> checkSchedule(@Valid @RequestBody CheckScheduleForm form, BindingResult bindingResult) {
        Long scheduleId;
        try {
            String token = encryptionService.serverDecrypt(form.getToken());
            List<String> parts = List.of(Objects.requireNonNull(ZipUtils.unzipString(token)).split(";"));
            scheduleId = ConvertUtils.parseLong(parts.get(0), -1L);
        } catch (Exception e) {
            throw new BadRequestException("Invalid token");
        }
        Schedule schedule = scheduleRepository.findById(scheduleId).orElse(null);
        if (schedule == null) {
            throw new BadRequestException(ErrorCode.SCHEDULE_ERROR_NOT_FOUND, "Not found schedule");
        }
        if (!AppConstant.SCHEDULE_TYPE_MANUAL_RENEW.equals(schedule.getType()) || AppConstant.SCHEDULE_KIND_EXACT_DATE.equals(schedule.getKind()) || !schedule.getIsSent()) {
            throw new BadRequestException("Not allowed to renew this schedule");
        }
        ZoneId zoneVN = ZoneId.of(SecurityConstant.TIMEZONE_VIETNAM);
        LocalDateTime now = LocalDateTime.now(zoneVN);
        LocalDateTime due = schedule.getDueDate().toInstant().atZone(zoneVN).toLocalDateTime();
        if (due.isAfter(now)) {
            throw new BadRequestException(ErrorCode.SCHEDULE_ERROR_ALREADY_CHECKED, "Schedule is already checked");
        }
        basicApiService.updateCheckedDate(schedule);
        return makeSuccessResponse(null, "Check schedule success");
    }
}
