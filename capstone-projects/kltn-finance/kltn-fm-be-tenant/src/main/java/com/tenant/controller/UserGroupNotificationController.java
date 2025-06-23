package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.userGroupNotification.UserGroupNotificationAdminDto;
import com.tenant.dto.userGroupNotification.UserGroupNotificationDto;
import com.tenant.form.userGroupNotification.CreateUserGroupNotificationForm;
import com.tenant.form.userGroupNotification.UpdateUserGroupNotificationForm;
import com.tenant.mapper.UserGroupNotificationMapper;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.model.criteria.*;
import com.tenant.storage.tenant.repository.*;
import com.tenant.service.KeyService;
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
@RequestMapping("/v1/user-group-notification")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class UserGroupNotificationController extends ABasicController{
    @Autowired
    private UserGroupNotificationRepository userGroupNotificationRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private NotificationGroupRepository notificationGroupRepository;
    @Autowired
    private UserGroupNotificationMapper userGroupNotificationMapper;
    @Autowired
    private KeyService keyService;

    @GetMapping(value = "/get/{id}", produces= MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('US_G_N_V')")
    public ApiMessageDto<UserGroupNotificationAdminDto> get(@PathVariable("id")  Long id) {
        UserGroupNotification userGroupNotification = userGroupNotificationRepository.findById(id).orElse(null);
        if (userGroupNotification == null){
            return makeErrorResponse(ErrorCode.USER_GROUP_NOTIFICATION_ERROR_NOT_FOUND, "Not found user group notification");
        }
        return makeSuccessResponse(userGroupNotificationMapper.fromEncryptEntityToEncryptUserGroupNotificationAdminDto(userGroupNotification, keyService.getFinanceKeyWrapper()), "Get user group notification success");
    }

    @GetMapping(value = "/list", produces= MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('US_G_N_L')")
    public ApiMessageDto<ResponseListDto<List<UserGroupNotificationAdminDto>>> list(UserGroupNotificationCriteria userGroupNotificationCriteria, Pageable pageable) {
        if (userGroupNotificationCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)){
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        Page<UserGroupNotification> userGroupNotifications = userGroupNotificationRepository.findAll(userGroupNotificationCriteria.getCriteria(), pageable);
        ResponseListDto<List<UserGroupNotificationAdminDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(userGroupNotificationMapper.fromEncryptEntityListToEncryptUserGroupNotificationAdminDtoList(userGroupNotifications.getContent(), keyService.getFinanceKeyWrapper()));
        responseListObj.setTotalPages(userGroupNotifications.getTotalPages());
        responseListObj.setTotalElements(userGroupNotifications.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list user group notification success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<UserGroupNotificationDto>>> autoComplete(UserGroupNotificationCriteria userGroupNotificationCriteria) {
        Pageable pageable = userGroupNotificationCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        userGroupNotificationCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        Page<UserGroupNotification> userGroupNotifications = userGroupNotificationRepository.findAll(userGroupNotificationCriteria.getCriteria(), pageable);
        ResponseListDto<List<UserGroupNotificationDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(userGroupNotificationMapper.fromEncryptEntityListToEncryptUserGroupNotificationDtoList(userGroupNotifications.getContent(), keyService.getFinanceKeyWrapper()));
        responseListObj.setTotalPages(userGroupNotifications.getTotalPages());
        responseListObj.setTotalElements(userGroupNotifications.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list user group notification success");
    }

    @PostMapping(value = "/create", produces= MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('US_G_N_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateUserGroupNotificationForm createUserGroupNotificationForm, BindingResult bindingResult) {
        Account account = accountRepository.findById(createUserGroupNotificationForm.getAccountId()).orElse(null);
        if (account == null){
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        NotificationGroup notificationGroup = notificationGroupRepository.findById(createUserGroupNotificationForm.getNotificationGroupId()).orElse(null);
        if (notificationGroup == null){
            return makeErrorResponse(ErrorCode.NOTIFICATION_GROUP_ERROR_NOT_FOUND, "Not found notification group");
        }
        UserGroupNotification existedByAccountIdAndNotificationGroupId = userGroupNotificationRepository.findFirstByAccountIdAndNotificationGroupId(account.getId(), notificationGroup.getId()).orElse(null);
        if (existedByAccountIdAndNotificationGroupId != null){
            return makeErrorResponse(ErrorCode.USER_GROUP_NOTIFICATION_ERROR_ACCOUNT_AND_NOTIFICATION_GROUP_EXISTED, "Notification group existed this account");
        }
        UserGroupNotification userGroupNotification = new UserGroupNotification();
        userGroupNotification.setAccount(account);
        userGroupNotification.setNotificationGroup(notificationGroup);
        userGroupNotificationRepository.save(userGroupNotification);
        return makeSuccessResponse(null, "Create user group notification success");
    }

    @PutMapping(value = "/update", produces= MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('US_G_N_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateUserGroupNotificationForm updateUserGroupNotificationForm, BindingResult bindingResult) {
        UserGroupNotification userGroupNotification = userGroupNotificationRepository.findById(updateUserGroupNotificationForm.getId()).orElse(null);
        if (userGroupNotification == null){
            return makeErrorResponse(ErrorCode.USER_GROUP_NOTIFICATION_ERROR_NOT_FOUND, "Not found user group notification");
        }
        Account account = accountRepository.findById(updateUserGroupNotificationForm.getAccountId()).orElse(null);
        if (account == null){
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        NotificationGroup notificationGroup = notificationGroupRepository.findById(updateUserGroupNotificationForm.getNotificationGroupId()).orElse(null);
        if (notificationGroup == null){
            return makeErrorResponse(ErrorCode.NOTIFICATION_GROUP_ERROR_NOT_FOUND, "Not found notification group");
        }
        if (!userGroupNotification.getAccount().getId().equals(updateUserGroupNotificationForm.getAccountId()) || !userGroupNotification.getNotificationGroup().getId().equals(updateUserGroupNotificationForm.getNotificationGroupId())){
            UserGroupNotification existedByAccountIdAndNotificationGroupId = userGroupNotificationRepository.findFirstByAccountIdAndNotificationGroupId(account.getId(), notificationGroup.getId()).orElse(null);
            if (existedByAccountIdAndNotificationGroupId != null){
                return makeErrorResponse(ErrorCode.USER_GROUP_NOTIFICATION_ERROR_ACCOUNT_AND_NOTIFICATION_GROUP_EXISTED, "Notification group existed this account");
            }
        }
        userGroupNotification.setAccount(account);
        userGroupNotification.setNotificationGroup(notificationGroup);
        userGroupNotificationRepository.save(userGroupNotification);
        return makeSuccessResponse(null, "Update user group notification success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('US_G_N_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        UserGroupNotification userGroupNotification = userGroupNotificationRepository.findById(id).orElse(null);
        if (userGroupNotification == null){
            return makeErrorResponse(ErrorCode.USER_GROUP_NOTIFICATION_ERROR_NOT_FOUND, "Not found user group notification");
        }
        userGroupNotificationRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete user group notification success");
    }
}
