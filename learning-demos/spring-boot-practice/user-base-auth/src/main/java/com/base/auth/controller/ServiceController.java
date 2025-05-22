package com.base.auth.controller;

import com.base.auth.constant.UserBaseConstant;
import com.base.auth.dto.ApiMessageDto;
import com.base.auth.dto.service.ServiceDto;
import com.base.auth.exception.UnauthorizationException;
import com.base.auth.form.service.CreateServiceForm;
import com.base.auth.form.service.UpdateProfileServiceForm;
import com.base.auth.form.service.UpdateServiceForm;
import com.base.auth.mapper.ServiceMapper;
import com.base.auth.model.Account;
import com.base.auth.model.Group;
import com.base.auth.model.Service;
import com.base.auth.model.criteria.ServiceCriteria;
import com.base.auth.repository.AccountRepository;
import com.base.auth.repository.ServiceRepository;
import com.base.auth.service.UserBaseApiService;
import com.base.auth.dto.ErrorCode;
import com.base.auth.dto.ResponseListDto;
import com.base.auth.repository.GroupRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import javax.validation.Valid;
import java.io.IOException;

@RestController
@RequestMapping("/v1/service")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class ServiceController extends ABasicController{
    @Autowired
    AccountRepository accountRepository;
    @Autowired
    ServiceRepository serviceRepository;

    @Autowired
    UserBaseApiService userBaseApiService;

    @Autowired
    GroupRepository groupRepository;

    @Autowired
    DataSource dataSource;

    @Autowired
    ServiceMapper serviceMapper;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    PasswordEncoder passwordEncoder;

    @PostMapping(value = "/create",  produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('S_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateServiceForm createServiceForm, BindingResult bindingResult) throws IOException {
        if(!isSuperAdmin()){
            throw new UnauthorizationException("Not allowed crate.");
        }
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        Account account = accountRepository.findAccountByUsername(createServiceForm.getUsername());
        if (account != null) {
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.SERVICE_ERROR_USERNAME_EXIST);
            return apiMessageDto;
        }
        Group group = groupRepository.findFirstByKind(UserBaseConstant.GROUP_KIND_MANAGER);
        if (group == null) {
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.SHOP_ACCOUNT_ERROR_UNKNOWN);
            return apiMessageDto;
        }
        Service service = serviceRepository.findFirstByTenantId(createServiceForm.getTenantId());
        if(service != null) {
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.SERVICE_ERROR_TENANT_ID_EXIST);
            return apiMessageDto;
        }
        account = new Account();
        account.setUsername(createServiceForm.getUsername());
        account.setPassword(passwordEncoder.encode(createServiceForm.getPassword()));
        account.setFullName(createServiceForm.getFullName());
        account.setKind(UserBaseConstant.USER_KIND_MANAGER);
        account.setGroup(group);
        account.setPhone(createServiceForm.getPhone());
        account.setEmail(createServiceForm.getEmail());
        account.setStatus(createServiceForm.getStatus());
        account.setAvatarPath(createServiceForm.getAvatarPath());
        account = accountRepository.save(account);


        service = new Service();
        service.setAccount(account);
        service.setTenantId(createServiceForm.getTenantId());
        service.setLogoPath(createServiceForm.getLogoPath());
        service.setBannerPath(createServiceForm.getBannerPath());
        service.setServiceName(createServiceForm.getServiceName());
        service.setLang(createServiceForm.getLang());
        service.setHotline(createServiceForm.getHotline());
        service.setSettings(createServiceForm.getSettings());
        service.setStatus(createServiceForm.getStatus());
        serviceRepository.save(service);

        apiMessageDto.setMessage("Create service success");
        return apiMessageDto;
    }


    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('S_L')")
    public ApiMessageDto<ResponseListDto<ServiceDto>> list(ServiceCriteria storeCriteria, Pageable pageable) {
        ApiMessageDto<ResponseListDto<ServiceDto>> apiMessageDto = new ApiMessageDto<>();

        if(!isSuperAdmin()){
            throw new UnauthorizationException("Not allowed for get list store.");
        }

        Page<Service> stores = serviceRepository.findAll(ServiceCriteria.findServiceByCriteria(storeCriteria), pageable);
        ResponseListDto<ServiceDto> responseListDto = new ResponseListDto(serviceMapper.fromEntityToCustomerDtoList(stores.getContent()),stores.getTotalElements(), stores.getTotalPages());
        apiMessageDto.setData(responseListDto);
        apiMessageDto.setMessage("Get list store success");
        return apiMessageDto;
    }

    @GetMapping(value = "/profile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ServiceDto> profile() {
        long id = getCurrentUser();
        var service = serviceRepository.findById(id).orElse(null);
        ApiMessageDto<ServiceDto> apiMessageDto = new ApiMessageDto<>();
        apiMessageDto.setData(serviceMapper.fromServiceToDto(service));
        apiMessageDto.setMessage("Get shop profile success");
        return apiMessageDto;

    }

    @PutMapping(value = "/update_profile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> updateProfile(@Valid @RequestBody UpdateProfileServiceForm updateProfileServiceForm, BindingResult bindingResult) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        long id = getCurrentUser();
        var account = accountRepository.findById(id).orElse(null);
        if (account == null) {
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.SERVICE_ERROR_NOT_FOUND);
            return apiMessageDto;
        }
        Service service = serviceRepository.findById(account.getId()).orElse(null);
        if(service == null) {
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.SERVICE_ERROR_NOT_FOUND);
            return apiMessageDto;
        }
        if(!passwordEncoder.matches(updateProfileServiceForm.getOldPassword(), account.getPassword())){
            apiMessageDto.setResult(false);
            apiMessageDto.setMessage("oldPassword not match in db");
            apiMessageDto.setCode(ErrorCode.SERVICE_ERROR_WRONG_OLD_PWD);
            return apiMessageDto;
        }


        if (StringUtils.isNoneBlank(updateProfileServiceForm.getPassword())) {
            account.setPassword(passwordEncoder.encode(updateProfileServiceForm.getPassword()));
        }
        account.setFullName(updateProfileServiceForm.getFullName());
        account.setEmail(updateProfileServiceForm.getEmail());
        if (StringUtils.isNoneBlank(updateProfileServiceForm.getAvatarPath())) {

            if(!updateProfileServiceForm.getAvatarPath().equals(account.getAvatarPath())){
                //delete old image
                userBaseApiService.deleteFile(account.getAvatarPath());
            }
            account.setAvatarPath(updateProfileServiceForm.getAvatarPath());
        }
        account.setPhone(updateProfileServiceForm.getPhone());
        accountRepository.save(account);

        service.setServiceName(updateProfileServiceForm.getServiceName());
        service.setHotline(updateProfileServiceForm.getHotline());
        service.setBannerPath(updateProfileServiceForm.getBannerPath());
        service.setLogoPath(updateProfileServiceForm.getLogo());
        serviceRepository.save(service);

        apiMessageDto.setMessage("Update shop profile success");
        return apiMessageDto;

    }

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('S_V')")
    public ApiMessageDto<ServiceDto> get(@PathVariable("id") Long id) {
        var store = serviceRepository.findById(id).orElse(null);
        ApiMessageDto<ServiceDto> apiMessageDto = new ApiMessageDto<>();
        apiMessageDto.setData(serviceMapper.fromServiceToDto(store));
        apiMessageDto.setMessage("Get store by id success");
        return apiMessageDto;
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('S_U')")
    public ApiMessageDto<String> updateB(@Valid @RequestBody UpdateServiceForm updateServiceForm, BindingResult bindingResult) throws IOException {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        if(!isSuperAdmin()){
            throw new UnauthorizationException("Not allowed update shop.");
        }

        Service service = serviceRepository.findById(updateServiceForm.getId()).orElse(null);
        if (service == null) {
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.SERVICE_ERROR_NOT_FOUND);
            return apiMessageDto;
        }
        if(!updateServiceForm.getServiceName().equals(service.getTenantId())) {
            Service serviceCheck = serviceRepository.findFirstByTenantId(updateServiceForm.getTenantId());
            if(serviceCheck != null) {
                apiMessageDto.setResult(false);
                apiMessageDto.setCode(ErrorCode.SERVICE_ERROR_TENANT_ID_EXIST);
                return apiMessageDto;
            }
        }
        if(StringUtils.isNoneBlank(updateServiceForm.getBannerPath())
                && !updateServiceForm.getBannerPath().equals(service.getBannerPath())) {
            //delete old image
            userBaseApiService.deleteFile(service.getBannerPath());
        }
        if(StringUtils.isNoneBlank(updateServiceForm.getLogoPath())
                && !updateServiceForm.getLogoPath().equals(service.getLogoPath())) {
            //delete old image
            userBaseApiService.deleteFile(service.getLogoPath());
        }
        serviceMapper.fromAdminUpdateFormToEntity(updateServiceForm, service);
        serviceRepository.save(service);

        apiMessageDto.setMessage("Update service success");
        return apiMessageDto;
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('S_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();

        if(!isSuperAdmin()){
            throw new UnauthorizationException("Not allowed to delete service.");
        }

        Service service = serviceRepository.findById(id).orElse(null);
        if (service == null) {
            apiMessageDto.setResult(false);
            apiMessageDto.setCode(ErrorCode.SERVICE_ERROR_NOT_FOUND);
            return apiMessageDto;

        }
        userBaseApiService.deleteFile(service.getBannerPath());
        userBaseApiService.deleteFile(service.getLogoPath());
        serviceRepository.deleteById(id);
        apiMessageDto.setMessage("Delete service success");
        return apiMessageDto;
    }
}
