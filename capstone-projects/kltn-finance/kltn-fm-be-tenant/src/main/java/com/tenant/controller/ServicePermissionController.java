package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.servicePermission.ServicePermissionAdminDto;
import com.tenant.dto.servicePermission.ServicePermissionDto;
import com.tenant.form.servicePermission.CreateServicePermissionForm;
import com.tenant.form.servicePermission.UpdateServicePermissionForm;
import com.tenant.mapper.ServicePermissionMapper;
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
@RequestMapping("/v1/service-permission")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class ServicePermissionController extends ABasicController {
    @Autowired
    private ServicePermissionRepository servicePermissionRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private ServiceGroupRepository serviceGroupRepository;
    @Autowired
    private ServicePermissionMapper servicePermissionMapper;
    @Autowired
    private KeyService keyService;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SER_P_V')")
    public ApiMessageDto<ServicePermissionAdminDto> get(@PathVariable("id") Long id) {
        ServicePermission servicePermission = servicePermissionRepository.findById(id).orElse(null);
        if (servicePermission == null) {
            return makeErrorResponse(ErrorCode.SERVICE_PERMISSION_ERROR_NOT_FOUND, "Not found service permission");
        }
        return makeSuccessResponse(servicePermissionMapper.fromEncryptEntityToEncryptServicePermissionAdminDto(servicePermission, keyService.getFinanceKeyWrapper()), "Get service permission success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SER_P_L')")
    public ApiMessageDto<ResponseListDto<List<ServicePermissionAdminDto>>> list(ServicePermissionCriteria servicePermissionCriteria, Pageable pageable) {
        if (servicePermissionCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        Page<ServicePermission> servicePermissions = servicePermissionRepository.findAll(servicePermissionCriteria.getCriteria(), pageable);
        ResponseListDto<List<ServicePermissionAdminDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(servicePermissionMapper.fromEncryptEntityListToEncryptServicePermissionAdminDtoList(servicePermissions.getContent(), keyService.getFinanceKeyWrapper()));
        responseListObj.setTotalPages(servicePermissions.getTotalPages());
        responseListObj.setTotalElements(servicePermissions.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list service permission success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<ServicePermissionDto>>> autoComplete(ServicePermissionCriteria servicePermissionCriteria) {
        Pageable pageable = servicePermissionCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        servicePermissionCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        Page<ServicePermission> servicePermissions = servicePermissionRepository.findAll(servicePermissionCriteria.getCriteria(), pageable);
        ResponseListDto<List<ServicePermissionDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(servicePermissionMapper.fromEncryptEntityListToEncryptServicePermissionDtoList(servicePermissions.getContent(), keyService.getFinanceKeyWrapper()));
        responseListObj.setTotalPages(servicePermissions.getTotalPages());
        responseListObj.setTotalElements(servicePermissions.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list service permission success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SER_P_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateServicePermissionForm createServicePermissionForm, BindingResult bindingResult) {
        ServicePermission servicePermission = new ServicePermission();
        servicePermission.setPermissionKind(createServicePermissionForm.getPermissionKind());
        Account account = accountRepository.findById(createServicePermissionForm.getAccountId()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        servicePermission.setAccount(account);
        if (servicePermission.getPermissionKind().equals(FinanceConstant.PERMISSION_KIND_ITEM)) {
            if (createServicePermissionForm.getServiceId() == null) {
                return makeErrorResponse(ErrorCode.SERVICE_ERROR_NOT_FOUND, "serviceId cannot be null");
            }
            Service service = serviceRepository.findById(createServicePermissionForm.getServiceId()).orElse(null);
            if (service == null) {
                return makeErrorResponse(ErrorCode.SERVICE_ERROR_NOT_FOUND, "Not found service");
            }
            if (servicePermissionRepository.findFirstByAccountIdAndServiceId(account.getId(), service.getId()).isPresent()) {
                return makeErrorResponse(ErrorCode.SERVICE_PERMISSION_ERROR_ACCOUNT_AND_SERVICE_EXISTED, "Service permission exists in this account");
            }
            servicePermission.setService(service);
        }
        if (servicePermission.getPermissionKind().equals(FinanceConstant.PERMISSION_KIND_GROUP)) {
            if (createServicePermissionForm.getServiceGroupId() == null) {
                return makeErrorResponse(ErrorCode.SERVICE_GROUP_ERROR_NOT_FOUND, "serviceGroupId cannot be null");
            }
            ServiceGroup serviceGroup = serviceGroupRepository.findById(createServicePermissionForm.getServiceGroupId()).orElse(null);
            if (serviceGroup == null) {
                return makeErrorResponse(ErrorCode.SERVICE_GROUP_ERROR_NOT_FOUND, "Not found service group");
            }
            if (servicePermissionRepository.findFirstByAccountIdAndServiceGroupId(account.getId(), serviceGroup.getId()).isPresent()) {
                return makeErrorResponse(ErrorCode.SERVICE_PERMISSION_ERROR_ACCOUNT_AND_SERVICE_GROUP_EXISTED, "Service group permission exists in this account");
            }
            servicePermission.setServiceGroup(serviceGroup);
        }
        servicePermissionRepository.save(servicePermission);
        return makeSuccessResponse(null, "Create service permission success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SER_P_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateServicePermissionForm updateServicePermissionForm, BindingResult bindingResult) {
        ServicePermission servicePermission = servicePermissionRepository.findById(updateServicePermissionForm.getId()).orElse(null);
        if (servicePermission == null) {
            return makeErrorResponse(ErrorCode.SERVICE_PERMISSION_ERROR_NOT_FOUND, "Not found service permission");
        }
        servicePermission.setPermissionKind(updateServicePermissionForm.getPermissionKind());
        Account account = accountRepository.findById(updateServicePermissionForm.getAccountId()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        servicePermission.setAccount(account);
        if (servicePermission.getPermissionKind().equals(FinanceConstant.PERMISSION_KIND_ITEM)) {
            if (updateServicePermissionForm.getServiceId() == null) {
                return makeErrorResponse(ErrorCode.SERVICE_ERROR_NOT_FOUND, "serviceId cannot be null");
            }
            Service service = serviceRepository.findById(updateServicePermissionForm.getServiceId()).orElse(null);
            if (service == null) {
                return makeErrorResponse(ErrorCode.SERVICE_ERROR_NOT_FOUND, "Not found service");
            }
            if (servicePermissionRepository.findFirstByAccountIdAndServiceId(account.getId(), service.getId()).isPresent()) {
                return makeErrorResponse(ErrorCode.SERVICE_PERMISSION_ERROR_ACCOUNT_AND_SERVICE_EXISTED, "Service permission exists in this account");
            }
            servicePermission.setService(service);
        } else {
            servicePermission.setService(null);
        }
        if (servicePermission.getPermissionKind().equals(FinanceConstant.PERMISSION_KIND_GROUP)) {
            if (updateServicePermissionForm.getServiceGroupId() == null) {
                return makeErrorResponse(ErrorCode.SERVICE_GROUP_ERROR_NOT_FOUND, "serviceGroupId cannot be null");
            }
            ServiceGroup serviceGroup = serviceGroupRepository.findById(updateServicePermissionForm.getServiceGroupId()).orElse(null);
            if (serviceGroup == null) {
                return makeErrorResponse(ErrorCode.SERVICE_GROUP_ERROR_NOT_FOUND, "Not found service group");
            }
            if (servicePermissionRepository.findFirstByAccountIdAndServiceGroupId(account.getId(), serviceGroup.getId()).isPresent()) {
                return makeErrorResponse(ErrorCode.SERVICE_PERMISSION_ERROR_ACCOUNT_AND_SERVICE_GROUP_EXISTED, "Service group permission exists in this account");
            }
            servicePermission.setServiceGroup(serviceGroup);
        } else {
            servicePermission.setServiceGroup(null);
        }
        servicePermissionRepository.save(servicePermission);
        return makeSuccessResponse(null, "Update service permission success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SER_P_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        ServicePermission servicePermission = servicePermissionRepository.findById(id).orElse(null);
        if (servicePermission == null) {
            return makeErrorResponse(ErrorCode.SERVICE_PERMISSION_ERROR_NOT_FOUND, "Not found service permission");
        }
        servicePermissionRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete service permission success");
    }
}
