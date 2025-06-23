package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.notificationGroup.NotificationGroupAdminDto;
import com.tenant.dto.notificationGroup.NotificationGroupDto;
import com.tenant.form.notificationGroup.CreateNotificationGroupForm;
import com.tenant.form.notificationGroup.UpdateNotificationGroupForm;
import com.tenant.mapper.NotificationGroupMapper;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.model.criteria.*;
import com.tenant.storage.tenant.repository.*;
import com.tenant.service.KeyService;
import com.tenant.utils.AESUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/v1/notification-group")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class NotificationGroupController extends ABasicController{
    @Autowired
    private NotificationGroupRepository notificationGroupRepository;
    @Autowired
    private NotificationGroupMapper notificationGroupMapper;
    @Autowired
    private KeyService keyService;

    @GetMapping(value = "/get/{id}", produces= MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('NO_G_V')")
    public ApiMessageDto<NotificationGroupAdminDto> get(@PathVariable("id")  Long id) {
        NotificationGroup notificationGroup = notificationGroupRepository.findById(id).orElse(null);
        if (notificationGroup == null){
            return makeErrorResponse(ErrorCode.NOTIFICATION_GROUP_ERROR_NOT_FOUND, "Not found notification group");
        }
        NotificationGroupAdminDto notificationGroupAdminDto = notificationGroupMapper.fromEncryptEntityToEncryptNotificationGroupAdminDto(notificationGroup, keyService.getFinanceKeyWrapper());
        return makeSuccessResponse(notificationGroupAdminDto, "Get notification group success");
    }

    @GetMapping(value = "/list", produces= MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('NO_G_L')")
    public ApiMessageDto<ResponseListDto<List<NotificationGroupAdminDto>>> list(NotificationGroupCriteria notificationGroupCriteria, Pageable pageable) {
        if (notificationGroupCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)){
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        Page<NotificationGroup> notificationGroups = notificationGroupRepository.findAll(notificationGroupCriteria.getCriteria(), pageable);
        ResponseListDto<List<NotificationGroupAdminDto>> responseListObj = new ResponseListDto<>();
        List<NotificationGroupAdminDto> notificationGroupAdminDtos = notificationGroupMapper.fromEncryptEntityListToEncryptNotificationGroupAdminDtoList(notificationGroups.getContent(), keyService.getFinanceKeyWrapper());
        responseListObj.setContent(notificationGroupAdminDtos);
        responseListObj.setTotalPages(notificationGroups.getTotalPages());
        responseListObj.setTotalElements(notificationGroups.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list notification group success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<NotificationGroupDto>>> autoComplete(NotificationGroupCriteria notificationGroupCriteria) {
        Pageable pageable = notificationGroupCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        notificationGroupCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        Page<NotificationGroup> notificationGroups = notificationGroupRepository.findAll(notificationGroupCriteria.getCriteria(), pageable);
        ResponseListDto<List<NotificationGroupDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(notificationGroupMapper.fromEncryptEntityListToEncryptNotificationGroupDtoList(notificationGroups.getContent(), keyService.getFinanceKeyWrapper()));
        responseListObj.setTotalPages(notificationGroups.getTotalPages());
        responseListObj.setTotalElements(notificationGroups.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list notification group success");
    }

    @PostMapping(value = "/create", produces= MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('NO_G_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateNotificationGroupForm createNotificationGroupForm, BindingResult bindingResult) {
        NotificationGroup notificationGroup = notificationGroupMapper.fromCreateNotificationGroupFormToEncryptEntity(createNotificationGroupForm, keyService.getFinanceSecretKey());
        NotificationGroup notificationGroupByName = notificationGroupRepository.findFirstByName(notificationGroup.getName()).orElse(null);
        if (notificationGroupByName != null){
            return makeErrorResponse(ErrorCode.NOTIFICATION_GROUP_ERROR_NAME_EXISTED, "Notification group name existed");
        }
        notificationGroupRepository.save(notificationGroup);
        return makeSuccessResponse(null, "Create notification group success");
    }

    @PutMapping(value = "/update", produces= MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('NO_G_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateNotificationGroupForm updateNotificationGroupForm, BindingResult bindingResult) {
        NotificationGroup notificationGroup = notificationGroupRepository.findById(updateNotificationGroupForm.getId()).orElse(null);
        if (notificationGroup == null){
            return makeErrorResponse(ErrorCode.NOTIFICATION_GROUP_ERROR_NOT_FOUND, "Not found notification group");
        }
        String encryptName = AESUtils.encrypt(keyService.getFinanceSecretKey(), updateNotificationGroupForm.getName(), FinanceConstant.AES_ZIP_ENABLE);
        if (!notificationGroup.getName().equals(encryptName)) {
            NotificationGroup notificationGroupByName = notificationGroupRepository.findFirstByName(encryptName).orElse(null);
            if (notificationGroupByName != null){
                return makeErrorResponse(ErrorCode.NOTIFICATION_GROUP_ERROR_NAME_EXISTED, "Notification group name existed");
            }
        }
        notificationGroupMapper.fromUpdateGroupFormToEncryptEntity(updateNotificationGroupForm, notificationGroup, keyService.getFinanceSecretKey());
        notificationGroupRepository.save(notificationGroup);
        return makeSuccessResponse(null, "Update notification group success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('NO_G_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        NotificationGroup notificationGroup = notificationGroupRepository.findById(id).orElse(null);
        if (notificationGroup == null){
            return makeErrorResponse(ErrorCode.NOTIFICATION_GROUP_ERROR_NOT_FOUND, "Not found notification group");
        }
        notificationGroupRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete notification service success");
    }
}
