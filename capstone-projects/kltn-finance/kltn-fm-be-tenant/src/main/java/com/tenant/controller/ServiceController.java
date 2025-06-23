package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.service.ServiceAdminDto;
import com.tenant.dto.service.ServiceDto;
import com.tenant.form.service.CreateServiceForm;
import com.tenant.form.service.ResolveServiceForm;
import com.tenant.form.service.UpdateServiceForm;
import com.tenant.mapper.ServiceMapper;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.model.criteria.*;
import com.tenant.storage.tenant.repository.*;
import com.tenant.service.KeyService;
import com.tenant.service.TransactionService;
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
import java.util.Objects;

@RestController
@RequestMapping("/v1/service")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class ServiceController extends ABasicController{
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private ServiceGroupRepository serviceGroupRepository;
    @Autowired
    private ServiceMapper serviceMapper;
    @Autowired
    private KeyService keyService;
    @Autowired
    private TransactionService transactionService;
    @Autowired
    private TagRepository tagRepository;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SE_V')")
    public ApiMessageDto<ServiceAdminDto> get(@PathVariable("id") Long id) {
        Service service = serviceRepository.findById(id).orElse(null);
        if(service == null){
            return makeErrorResponse(ErrorCode.SERVICE_ERROR_NOT_FOUND, "Not found service");
        }
        ServiceAdminDto serviceAdminDto = serviceMapper.fromEncryptEntityToEncryptServiceAdminDto(service, keyService.getFinanceKeyWrapper());
        return makeSuccessResponse(serviceAdminDto, "Get service success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SE_L')")
    public ApiMessageDto<ResponseListDto<List<ServiceAdminDto>>> list(ServiceCriteria serviceCriteria, Pageable pageable) {
        if (serviceCriteria.getSortDate() == null){
            serviceCriteria.setSortDate(FinanceConstant.SORT_DATE_DESC);
        }
        if (serviceCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)){
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        if (!isCustomer()) {
            serviceCriteria.setPermissionAccountId(getCurrentUser());
        }
        Page<Service> services = serviceRepository.findAll(serviceCriteria.getCriteria(), pageable);
        ResponseListDto<List<ServiceAdminDto>> responseListObj = new ResponseListDto<>();
        List<ServiceAdminDto> serviceAdminDtos = serviceMapper.fromEncryptEntityListToEncryptServiceAdminDtoList(services.getContent(), keyService.getFinanceKeyWrapper());
        responseListObj.setContent(serviceAdminDtos);
        responseListObj.setTotalPages(services.getTotalPages());
        responseListObj.setTotalElements(services.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list service success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<ServiceDto>>> autoComplete(ServiceCriteria serviceCriteria) {
        Pageable pageable = serviceCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        serviceCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        if (!isCustomer()) {
            serviceCriteria.setPermissionAccountId(getCurrentUser());
        }
        Page<Service> services = serviceRepository.findAll(serviceCriteria.getCriteria(), pageable);
        ResponseListDto<List<ServiceDto>> responseListObj = new ResponseListDto<>();
        List<ServiceDto> serviceDtos = serviceMapper.fromEncryptEntityListToEncryptServiceDtoAutoCompleteList(services.getContent(), keyService.getFinanceKeyWrapper());
        responseListObj.setContent(serviceDtos);
        responseListObj.setTotalPages(services.getTotalPages());
        responseListObj.setTotalElements(services.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list service success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SE_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateServiceForm createServiceForm, BindingResult bindingResult) {
        String nameService = AESUtils.encrypt(keyService.getFinanceSecretKey(), createServiceForm.getName(), FinanceConstant.AES_ZIP_ENABLE);
        Service serviceByNameAndKind = serviceRepository.findFirstByNameAndKind(nameService, createServiceForm.getKind()).orElse(null);
        if (serviceByNameAndKind != null){
            return makeErrorResponse(ErrorCode.SERVICE_ERROR_NAME_EXISTED, "Service name existed in this kind");
        }
        if (createServiceForm.getPeriodKind().equals(FinanceConstant.SERVICE_PERIOD_KIND_FIX_DAY) && createServiceForm.getStartDate().after(createServiceForm.getExpirationDate())) {
            return makeErrorResponse(ErrorCode.SERVICE_ERROR_DATE_INVALID, "Start date must be before expiration date");
        }
        Service service = serviceMapper.fromCreateServiceFormToEncryptEntity(createServiceForm, keyService.getFinanceSecretKey());
        if (createServiceForm.getServiceGroupId() != null) {
            ServiceGroup serviceGroup = serviceGroupRepository.findById(createServiceForm.getServiceGroupId()).orElse(null);
            if (serviceGroup == null){
                return makeErrorResponse(ErrorCode.SERVICE_GROUP_ERROR_NOT_FOUND, "Not found service group");
            }
            service.setServiceGroup(serviceGroup);
        }
        if (createServiceForm.getTagId() != null) {
            Tag tag = tagRepository.findById(createServiceForm.getTagId()).orElse(null);
            if (tag == null) {
                return makeErrorResponse(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            if (!FinanceConstant.TAG_KIND_SERVICE.equals(tag.getKind())) {
                return makeErrorResponse(ErrorCode.SERVICE_ERROR_TAG_INVALID, "Tag kind does not match");
            }
            service.setTag(tag);
        }
        serviceRepository.save(service);
        transactionService.updateExpirationDate(service);
        return makeSuccessResponse(null, "Create service success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SE_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateServiceForm updateServiceForm, BindingResult bindingResult) {
        Service service = serviceRepository.findById(updateServiceForm.getId()).orElse(null);
        if(service == null){
            return makeErrorResponse(ErrorCode.SERVICE_ERROR_NOT_FOUND, "Not found service");
        }
        String nameService = AESUtils.encrypt(keyService.getFinanceSecretKey(), updateServiceForm.getName(), FinanceConstant.AES_ZIP_ENABLE);
        if (!service.getName().equals(nameService)){
            Service serviceByNameAndKind = serviceRepository.findFirstByNameAndKind(nameService, updateServiceForm.getKind()).orElse(null);
            if (serviceByNameAndKind != null){
                return makeErrorResponse(ErrorCode.SERVICE_ERROR_NAME_EXISTED, "Service name existed in this kind");
            }
        }
        if (updateServiceForm.getPeriodKind().equals(FinanceConstant.SERVICE_PERIOD_KIND_FIX_DAY) && updateServiceForm.getStartDate().after(updateServiceForm.getExpirationDate())) {
            return makeErrorResponse(ErrorCode.SERVICE_ERROR_DATE_INVALID, "Start date must be before expiration date");
        }
        boolean isStartDateChanged = !Objects.equals(service.getStartDate(), updateServiceForm.getStartDate());
        boolean isExpirationDateChanged = !Objects.equals(service.getExpirationDate(), updateServiceForm.getExpirationDate());
        boolean isPeriodKindChanged = !Objects.equals(service.getExpirationDate(), updateServiceForm.getExpirationDate());
        serviceMapper.fromUpdateServiceFormToEncryptEntity(updateServiceForm, service, keyService.getFinanceSecretKey());
        if (updateServiceForm.getServiceGroupId() != null) {
            ServiceGroup serviceGroup = serviceGroupRepository.findById(updateServiceForm.getServiceGroupId()).orElse(null);
            if (serviceGroup == null){
                return makeErrorResponse(ErrorCode.SERVICE_GROUP_ERROR_NOT_FOUND, "Not found service group");
            }
            service.setServiceGroup(serviceGroup);
        } else {
            service.setServiceGroup(null);
        }
        if (updateServiceForm.getTagId() != null) {
            Tag tag = tagRepository.findById(updateServiceForm.getTagId()).orElse(null);
            if (tag == null) {
                return makeErrorResponse(ErrorCode.TAG_ERROR_NOT_FOUND, "Not found tag");
            }
            if (!FinanceConstant.TAG_KIND_SERVICE.equals(tag.getKind())) {
                return makeErrorResponse(ErrorCode.SERVICE_ERROR_TAG_INVALID, "Tag kind does not match");
            }
            service.setTag(tag);
        } else {
            service.setTag(null);
        }
        serviceRepository.save(service);
        if (isStartDateChanged || isExpirationDateChanged || isPeriodKindChanged) {
            transactionService.updateExpirationDate(service);
        }
        return makeSuccessResponse(null, "Update service success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SE_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Service service = serviceRepository.findById(id).orElse(null);
        if(service == null){
            return makeErrorResponse(ErrorCode.SERVICE_ERROR_NOT_FOUND, "Not found service");
        }
        serviceRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete service success");
    }

    @PutMapping(value = "/resolve", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('SE_R')")
    public ApiMessageDto<String> resolve(@Valid @RequestBody ResolveServiceForm resolveServiceForm, BindingResult bindingResult) {
        Service service = serviceRepository.findById(resolveServiceForm.getId()).orElse(null);
        if (service == null) {
            return makeErrorResponse(ErrorCode.SERVICE_ERROR_NOT_FOUND, "Not found service");
        }
        if (FinanceConstant.BOOLEAN_TRUE.equals(service.getIsPaid())) {
            return makeErrorResponse(ErrorCode.SERVICE_ERROR_ALREADY_PAID, "Service has already been paid");
        }
        if (service.getPeriodKind().equals(FinanceConstant.SERVICE_PERIOD_KIND_FIX_DAY)) {
            service.setIsPaid(FinanceConstant.BOOLEAN_TRUE);
        } else {
            if (transactionService.isNotValidExpirationDate(service.getStartDate(), resolveServiceForm.getExpirationDate(), service.getPeriodKind())) {
                return makeErrorResponse(ErrorCode.SERVICE_ERROR_DATE_INVALID, "Invalid expiration date");
            }
            service.setIsPaid(FinanceConstant.BOOLEAN_FALSE);
            service.setExpirationDate(resolveServiceForm.getExpirationDate());
        }
        serviceRepository.save(service);
        return makeSuccessResponse(null, "Resolve service success");
    }
}