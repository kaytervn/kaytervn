package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.keyInformationGroup.KeyInformationGroupAdminDto;
import com.tenant.dto.keyInformationGroup.KeyInformationGroupDto;
import com.tenant.exception.BadRequestException;
import com.tenant.form.keyInformationGroup.CreateKeyInformationGroupForm;
import com.tenant.form.keyInformationGroup.UpdateKeyInformationGroupForm;
import com.tenant.mapper.KeyInformationGroupMapper;
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
@RequestMapping("/v1/key-information-group")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class KeyInformationGroupController extends ABasicController {
    @Autowired
    private KeyInformationGroupRepository keyInformationGroupRepository;
    @Autowired
    private KeyInformationGroupMapper keyInformationGroupMapper;
    @Autowired
    private KeyInformationRepository keyInformationRepository;
    @Autowired
    private KeyService keyService;
    @Autowired
    private KeyInformationPermissionRepository keyInformationPermissionRepository;
    @Autowired
    private AccountRepository accountRepository;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('KE_I_G_V')")
    public ApiMessageDto<KeyInformationGroupAdminDto> get(@PathVariable("id") Long id) {
        KeyInformationGroup keyInformationGroup = keyInformationGroupRepository.findById(id).orElse(null);
        if (keyInformationGroup == null) {
            return makeErrorResponse(ErrorCode.KEY_INFORMATION_GROUP_ERROR_NOT_FOUND, "Not found key information group");
        }
        KeyInformationGroupAdminDto keyInformationGroupAdminDto = keyInformationGroupMapper.fromEncryptEntityToEncryptKeyInformationGroupAdminDto(keyInformationGroup, keyService.getFinanceKeyWrapper());
        return makeSuccessResponse(keyInformationGroupAdminDto, "Get key information group success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('KE_I_G_L')")
    public ApiMessageDto<ResponseListDto<List<KeyInformationGroupAdminDto>>> list(KeyInformationGroupCriteria keyInformationGroupCriteria, Pageable pageable) {
        if (keyInformationGroupCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)){
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        if (!isCustomer()) {
            keyInformationGroupCriteria.setPermissionAccountId(getCurrentUser());
        }
        Page<KeyInformationGroup> groups = keyInformationGroupRepository.findAll(keyInformationGroupCriteria.getCriteria(), pageable);
        List<KeyInformationGroupAdminDto> keyInformationGroupAdminDtos = keyInformationGroupMapper.fromEncryptEntityListToEncryptKeyInformationGroupAdminDtoList(groups.getContent(), keyService.getFinanceKeyWrapper());
        ResponseListDto<List<KeyInformationGroupAdminDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(keyInformationGroupAdminDtos);
        responseListObj.setTotalPages(groups.getTotalPages());
        responseListObj.setTotalElements(groups.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list key information group success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<KeyInformationGroupDto>>> autoComplete(KeyInformationGroupCriteria keyInformationGroupCriteria) {
        Pageable pageable = keyInformationGroupCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        keyInformationGroupCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        if (!isCustomer()) {
            keyInformationGroupCriteria.setPermissionAccountId(getCurrentUser());
        }
        Page<KeyInformationGroup> groups = keyInformationGroupRepository.findAll(keyInformationGroupCriteria.getCriteria(), pageable);
        ResponseListDto<List<KeyInformationGroupDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(keyInformationGroupMapper.fromEncryptEntityListToEncryptKeyInformationGroupDtoAutoCompleteList(groups.getContent(), keyService.getFinanceKeyWrapper()));
        responseListObj.setTotalPages(groups.getTotalPages());
        responseListObj.setTotalElements(groups.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list key information group success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('KE_I_G_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateKeyInformationGroupForm createKeyInformationGroupForm, BindingResult bindingResult) {
        String nameKeyInformationGroup = AESUtils.encrypt(keyService.getFinanceSecretKey(), createKeyInformationGroupForm.getName(), FinanceConstant.AES_ZIP_ENABLE);
        KeyInformationGroup keyInformationGroupByName = keyInformationGroupRepository.findFirstByName(nameKeyInformationGroup).orElse(null);
        if(keyInformationGroupByName != null){
            return makeErrorResponse(ErrorCode.KEY_INFORMATION_GROUP_ERROR_NAME_EXISTED, "Name existed");
        }
        KeyInformationGroup keyInformationGroup = keyInformationGroupMapper.fromCreateKeyInformationGroupFormToEntity(createKeyInformationGroupForm, keyService.getFinanceSecretKey());
        keyInformationGroupRepository.save(keyInformationGroup);
        if (!isCustomer()) {
            Account account = accountRepository.findById(getCurrentUser()).orElse(null);
            if (account == null) {
                throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
            }
            KeyInformationPermission keyInformationPermission = new KeyInformationPermission();
            keyInformationPermission.setKeyInformationGroup(keyInformationGroup);
            keyInformationPermission.setPermissionKind(FinanceConstant.PERMISSION_KIND_GROUP);
            keyInformationPermission.setAccount(account);
            keyInformationPermissionRepository.save(keyInformationPermission);
        }
        return makeSuccessResponse(null, "Create key information group success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('KE_I_G_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateKeyInformationGroupForm updateKeyInformationGroupForm, BindingResult bindingResult) {
        KeyInformationGroup keyInformationGroup = keyInformationGroupRepository.findById(updateKeyInformationGroupForm.getId()).orElse(null);
        if (keyInformationGroup == null) {
            return makeErrorResponse(ErrorCode.KEY_INFORMATION_GROUP_ERROR_NOT_FOUND, "Not found key information group");
        }
        String nameKeyInformationGroup = AESUtils.encrypt(keyService.getFinanceSecretKey(), updateKeyInformationGroupForm.getName(), FinanceConstant.AES_ZIP_ENABLE);
        if(!keyInformationGroup.getName().equals(nameKeyInformationGroup)){
            KeyInformationGroup keyInformationGroupByName = keyInformationGroupRepository.findFirstByName(nameKeyInformationGroup).orElse(null);
            if(keyInformationGroupByName != null){
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_GROUP_ERROR_NAME_EXISTED, "Name existed");
            }
        }
        keyInformationGroupMapper.fromUpdateKeyInformationGroupFormToEntity(updateKeyInformationGroupForm, keyInformationGroup, keyService.getFinanceSecretKey());
        keyInformationGroupRepository.save(keyInformationGroup);
        return makeSuccessResponse(null, "Update key information group success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('KE_I_G_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        KeyInformationGroup keyInformationGroup = keyInformationGroupRepository.findById(id).orElse(null);
        if (keyInformationGroup == null) {
            return makeErrorResponse(ErrorCode.KEY_INFORMATION_GROUP_ERROR_NOT_FOUND, "Not found key information group");
        }
        if (keyInformationRepository.existsByKeyInformationGroupId(id)) {
            throw new BadRequestException(ErrorCode.GENERAL_ERROR_NOT_ALLOWED_DELETE, "Key existed with this group");
        }
        keyInformationGroupRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete key information group success");
    }
}
