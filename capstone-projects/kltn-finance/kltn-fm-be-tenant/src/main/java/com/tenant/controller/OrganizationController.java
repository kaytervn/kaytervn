package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.organization.OrganizationAdminDto;
import com.tenant.dto.organization.OrganizationDto;
import com.tenant.exception.BadRequestException;
import com.tenant.form.organization.CreateOrganizationForm;
import com.tenant.form.organization.UpdateOrganizationForm;
import com.tenant.mapper.OrganizationMapper;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.model.criteria.*;
import com.tenant.storage.tenant.repository.*;
import com.tenant.service.FinanceApiService;
import com.tenant.service.KeyService;
import com.tenant.utils.AESUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
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
@RequestMapping("/v1/organization")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class OrganizationController extends ABasicController {
    @Autowired
    private OrganizationRepository organizationRepository;
    @Autowired
    private OrganizationMapper organizationMapper;
    @Autowired
    private KeyInformationRepository keyInformationRepository;
    @Autowired
    private KeyService keyService;
    @Autowired
    private FinanceApiService financeApiService;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private OrganizationPermissionRepository organizationPermissionRepository;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('OR_V')")
    public ApiMessageDto<OrganizationAdminDto> get(@PathVariable("id") Long id) {
        Organization organization = organizationRepository.findById(id).orElse(null);
        if (organization == null) {
            return makeErrorResponse(ErrorCode.ORGANIZATION_ERROR_NOT_FOUND, "Not found organization");
        }
        OrganizationAdminDto organizationAdminDto = organizationMapper.fromEncryptEntityToEncryptOrganizationAdminDto(organization, keyService.getFinanceKeyWrapper());
        return makeSuccessResponse(organizationAdminDto, "Get organization success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('OR_L')")
    public ApiMessageDto<ResponseListDto<List<OrganizationAdminDto>>> list(OrganizationCriteria organizationCriteria, Pageable pageable) {
        if (organizationCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)){
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        if (!isCustomer()) {
            organizationCriteria.setPermissionAccountId(getCurrentUser());
        }
        Page<Organization> organizations = organizationRepository.findAll(organizationCriteria.getCriteria(), pageable);
        List<OrganizationAdminDto> organizationAdminDtos = organizationMapper.fromEncryptEntityListToEncryptOrganizationAdminDtoList(organizations.getContent(), keyService.getFinanceKeyWrapper());
        ResponseListDto<List<OrganizationAdminDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(organizationAdminDtos);
        responseListObj.setTotalPages(organizations.getTotalPages());
        responseListObj.setTotalElements(organizations.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list organization success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<OrganizationDto>>> autoComplete(OrganizationCriteria organizationCriteria) {
        Pageable pageable = organizationCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        organizationCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        if (!isCustomer()) {
            organizationCriteria.setPermissionAccountId(getCurrentUser());
        }
        Page<Organization> organizations = organizationRepository.findAll(organizationCriteria.getCriteria(), pageable);
        ResponseListDto<List<OrganizationDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(organizationMapper.fromEncryptEntityListToEncryptOrganizationDtoAutoCompleteList(organizations.getContent(), keyService.getFinanceKeyWrapper()));
        responseListObj.setTotalPages(organizations.getTotalPages());
        responseListObj.setTotalElements(organizations.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list organization success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('OR_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateOrganizationForm createOrganizationForm, BindingResult bindingResult) {
        String nameOrganization = AESUtils.encrypt(keyService.getFinanceSecretKey(), createOrganizationForm.getName(), FinanceConstant.AES_ZIP_ENABLE);
        Organization organizationByName = organizationRepository.findFirstByName(nameOrganization).orElse(null);
        if(organizationByName != null){
            return makeErrorResponse(ErrorCode.ORGANIZATION_ERROR_NAME_EXISTED, "Name existed");
        }
        Organization organization = organizationMapper.fromCreateOrganizationFormToEntity(createOrganizationForm, keyService.getFinanceSecretKey());
        organizationRepository.save(organization);
        if (!isCustomer()) {
            Account account = accountRepository.findById(getCurrentUser()).orElse(null);
            if (account == null) {
                throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
            }
            OrganizationPermission permission = new OrganizationPermission();
            permission.setOrganization(organization);
            permission.setAccount(account);
            organizationPermissionRepository.save(permission);
        }
        return makeSuccessResponse(null, "Create organization success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('OR_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateOrganizationForm updateOrganizationForm, BindingResult bindingResult) {
        Organization organization = organizationRepository.findById(updateOrganizationForm.getId()).orElse(null);
        if (organization == null) {
            return makeErrorResponse(ErrorCode.ORGANIZATION_ERROR_NOT_FOUND, "Not found organization");
        }
        String nameOrganization = AESUtils.encrypt(keyService.getFinanceSecretKey(), updateOrganizationForm.getName(), FinanceConstant.AES_ZIP_ENABLE);
        if (!organization.getName().equals(nameOrganization) && organizationRepository.findFirstByName(nameOrganization).isPresent()) {
            return makeErrorResponse(ErrorCode.ORGANIZATION_ERROR_NAME_EXISTED, "Name existed");
        }
        String decryptOldLogo = AESUtils.decrypt(keyService.getFinanceSecretKey(), organization.getLogo(), FinanceConstant.AES_ZIP_ENABLE);
        if (StringUtils.isNoneBlank(updateOrganizationForm.getLogo()) && !updateOrganizationForm.getLogo().equals(decryptOldLogo)) {
            financeApiService.deleteFile(decryptOldLogo);
        }
        organizationMapper.fromUpdateOrganizationFormToEntity(updateOrganizationForm, organization, keyService.getFinanceSecretKey());
        organizationRepository.save(organization);
        return makeSuccessResponse(null, "Update organization success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('OR_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Organization organization = organizationRepository.findById(id).orElse(null);
        if (organization == null) {
            return makeErrorResponse(ErrorCode.ORGANIZATION_ERROR_NOT_FOUND, "Not found organization");
        }
        String decryptOldLogo = AESUtils.decrypt(keyService.getFinanceSecretKey(), organization.getLogo(), FinanceConstant.AES_ZIP_ENABLE);
        financeApiService.deleteFile(decryptOldLogo);
        keyInformationRepository.updateAllByOrganizationId(id);
        projectRepository.updateAllByOrganizationId(id);
        organizationRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete organization success");
    }
}
