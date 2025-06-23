package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.serviceGroup.ServiceGroupAdminDto;
import com.tenant.dto.serviceGroup.ServiceGroupDto;
import com.tenant.exception.BadRequestException;
import com.tenant.form.serviceGroup.CreateServiceGroupForm;
import com.tenant.form.serviceGroup.UpdateServiceGroupForm;
import com.tenant.mapper.ServiceGroupMapper;
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
@RequestMapping("/v1/service-group")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class ServiceGroupController extends ABasicController {
    @Autowired
    private ServiceGroupRepository serviceGroupRepository;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private ServiceGroupMapper serviceGroupMapper;
    @Autowired
    private KeyService keyService;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private ServicePermissionRepository servicePermissionRepository;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SE_G_V')")
    public ApiMessageDto<ServiceGroupAdminDto> get(@PathVariable("id") Long id) {
        ServiceGroup serviceGroup = serviceGroupRepository.findById(id).orElse(null);
        if (serviceGroup == null) {
            return makeErrorResponse(ErrorCode.SERVICE_GROUP_ERROR_NOT_FOUND, "Not found service group");
        }
        ServiceGroupAdminDto serviceGroupAdminDto = serviceGroupMapper.fromEncryptEntityToEncryptServiceGroupAdminDto(serviceGroup, keyService.getFinanceKeyWrapper());
        return makeSuccessResponse(serviceGroupAdminDto, "Get service group success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SE_G_L')")
    public ApiMessageDto<ResponseListDto<List<ServiceGroupAdminDto>>> list(ServiceGroupCriteria serviceGroupCriteria, Pageable pageable) {
        if (serviceGroupCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)){
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        if (!isCustomer()) {
            serviceGroupCriteria.setPermissionAccountId(getCurrentUser());
        }
        Page<ServiceGroup> serviceGroups = serviceGroupRepository.findAll(serviceGroupCriteria.getCriteria(), pageable);
        ResponseListDto<List<ServiceGroupAdminDto>> responseListObj = new ResponseListDto<>();
        List<ServiceGroupAdminDto> serviceGroupAdminDtos = serviceGroupMapper.fromEncryptEntityListToEncryptServiceGroupAdminDtoList(serviceGroups.getContent(), keyService.getFinanceKeyWrapper());
        responseListObj.setContent(serviceGroupAdminDtos);
        responseListObj.setTotalPages(serviceGroups.getTotalPages());
        responseListObj.setTotalElements(serviceGroups.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list service group success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<ServiceGroupDto>>> autoComplete(ServiceGroupCriteria serviceGroupCriteria) {
        if (!isCustomer()) {
            serviceGroupCriteria.setPermissionAccountId(getCurrentUser());
        }
        Pageable pageable = serviceGroupCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        serviceGroupCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        Page<ServiceGroup> serviceGroups = serviceGroupRepository.findAll(serviceGroupCriteria.getCriteria(), pageable);
        ResponseListDto<List<ServiceGroupDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(serviceGroupMapper.fromEncryptEntityListToEncryptServiceGroupDtoList(serviceGroups.getContent(), keyService.getFinanceKeyWrapper()));
        responseListObj.setTotalPages(serviceGroups.getTotalPages());
        responseListObj.setTotalElements(serviceGroups.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list service group success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SE_G_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateServiceGroupForm createServiceGroupForm, BindingResult bindingResult) {
        ServiceGroup serviceGroup = serviceGroupMapper.fromCreateServiceGroupFormToEncryptEntity(createServiceGroupForm, keyService.getFinanceSecretKey());
        ServiceGroup serviceGroupByName = serviceGroupRepository.findFirstByName(serviceGroup.getName()).orElse(null);
        if (serviceGroupByName != null) {
            return makeErrorResponse(ErrorCode.SERVICE_GROUP_ERROR_NAME_EXISTED, "Name service group existed");
        }
        serviceGroupRepository.save(serviceGroup);
        if (!isCustomer()) {
            Account account = accountRepository.findById(getCurrentUser()).orElse(null);
            if (account == null) {
                throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
            }
            ServicePermission permission = new ServicePermission();
            permission.setServiceGroup(serviceGroup);
            permission.setPermissionKind(FinanceConstant.PERMISSION_KIND_GROUP);
            permission.setAccount(account);
            servicePermissionRepository.save(permission);
        }
        return makeSuccessResponse(null, "Create service group success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SE_G_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateServiceGroupForm updateServiceGroupForm, BindingResult bindingResult) {
        ServiceGroup serviceGroup = serviceGroupRepository.findById(updateServiceGroupForm.getId()).orElse(null);
        if (serviceGroup == null) {
            return makeErrorResponse(ErrorCode.SERVICE_GROUP_ERROR_NOT_FOUND, "Not found service group");
        }
        String encryptName = AESUtils.encrypt(keyService.getFinanceSecretKey(), updateServiceGroupForm.getName(), FinanceConstant.AES_ZIP_ENABLE);
        if (!serviceGroup.getName().equals(encryptName)) {
            ServiceGroup serviceGroupByName = serviceGroupRepository.findFirstByName(encryptName).orElse(null);
            if (serviceGroupByName != null) {
                return makeErrorResponse(ErrorCode.SERVICE_GROUP_ERROR_NAME_EXISTED, "Name service group existed");
            }
        }
        serviceGroupMapper.fromUpdateServiceGroupFormToEncryptEntity(updateServiceGroupForm, serviceGroup, keyService.getFinanceSecretKey());
        serviceGroupRepository.save(serviceGroup);
        return makeSuccessResponse(null, "Update service group success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SE_G_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        ServiceGroup serviceGroup = serviceGroupRepository.findById(id).orElse(null);
        if (serviceGroup == null) {
            return makeErrorResponse(ErrorCode.SERVICE_GROUP_ERROR_NOT_FOUND, "Not found service group");
        }
        if (serviceRepository.existsByServiceGroupId(id)) {
            throw new BadRequestException(ErrorCode.GENERAL_ERROR_NOT_ALLOWED_DELETE, "Service existed in this group");
        }
        serviceRepository.updateAllByServiceGroupId(id);
        serviceGroupRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete service group success");
    }
}
