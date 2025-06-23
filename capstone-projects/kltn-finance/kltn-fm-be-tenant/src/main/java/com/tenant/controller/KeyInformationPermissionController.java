package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.KeyInformationPermission.KeyInformationPermissionAdminDto;
import com.tenant.dto.KeyInformationPermission.KeyInformationPermissionDto;
import com.tenant.form.keyInformationPermission.CreateKeyInformationPermissionForm;
import com.tenant.form.keyInformationPermission.UpdateKeyInformationPermissionForm;
import com.tenant.mapper.KeyInformationPermissionMapper;
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
@RequestMapping("/v1/key-information-permission")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class KeyInformationPermissionController extends ABasicController {
    @Autowired
    private KeyInformationPermissionRepository keyInformationPermissionRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private KeyInformationRepository keyInformationRepository;
    @Autowired
    private KeyInformationGroupRepository keyInformationGroupRepository;
    @Autowired
    private KeyInformationPermissionMapper keyInformationPermissionMapper;
    @Autowired
    private KeyService keyService;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('KE_I_P_V')")
    public ApiMessageDto<KeyInformationPermissionAdminDto> get(@PathVariable("id") Long id) {
        KeyInformationPermission keyInformationPermission = keyInformationPermissionRepository.findById(id).orElse(null);
        if (keyInformationPermission == null) {
            return makeErrorResponse(ErrorCode.KEY_INFORMATION_PERMISSION_ERROR_NOT_FOUND, "Not found key information permission");
        }
        return makeSuccessResponse(keyInformationPermissionMapper.fromEncryptEntityToEncryptKeyInformationPermissionAdminDto(keyInformationPermission, keyService.getKeyInformationKeyWrapper(), keyService.getFinanceSubKeyWrapper()), "Get key information permission success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('KE_I_P_L')")
    public ApiMessageDto<ResponseListDto<List<KeyInformationPermissionAdminDto>>> list(KeyInformationPermissionCriteria keyInformationPermissionCriteria, Pageable pageable) {
        if (keyInformationPermissionCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        Page<KeyInformationPermission> keyInformationPermissions = keyInformationPermissionRepository.findAll(keyInformationPermissionCriteria.getCriteria(), pageable);
        ResponseListDto<List<KeyInformationPermissionAdminDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(keyInformationPermissionMapper.fromEncryptEntityListToEncryptKeyInformationPermissionAdminDtoList(keyInformationPermissions.getContent(), keyService.getKeyInformationKeyWrapper(), keyService.getFinanceSubKeyWrapper()));
        responseListObj.setTotalPages(keyInformationPermissions.getTotalPages());
        responseListObj.setTotalElements(keyInformationPermissions.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list key information permission success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<KeyInformationPermissionDto>>> autoComplete(KeyInformationPermissionCriteria keyInformationPermissionCriteria) {
        Pageable pageable = keyInformationPermissionCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        keyInformationPermissionCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        Page<KeyInformationPermission> keyInformationPermissions = keyInformationPermissionRepository.findAll(keyInformationPermissionCriteria.getCriteria(), pageable);
        ResponseListDto<List<KeyInformationPermissionDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(keyInformationPermissionMapper.fromEncryptEntityListToEncryptKeyInformationPermissionDtoList(keyInformationPermissions.getContent(), keyService.getKeyInformationKeyWrapper(), keyService.getFinanceSubKeyWrapper()));
        responseListObj.setTotalPages(keyInformationPermissions.getTotalPages());
        responseListObj.setTotalElements(keyInformationPermissions.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list key information permission success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('KE_I_P_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateKeyInformationPermissionForm createKeyInformationPermissionForm, BindingResult bindingResult) {
        KeyInformationPermission keyInformationPermission = new KeyInformationPermission();
        keyInformationPermission.setPermissionKind(createKeyInformationPermissionForm.getPermissionKind());
        Account account = accountRepository.findById(createKeyInformationPermissionForm.getAccountId()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        keyInformationPermission.setAccount(account);
        if (keyInformationPermission.getPermissionKind().equals(FinanceConstant.PERMISSION_KIND_ITEM)) {
            if (createKeyInformationPermissionForm.getKeyInformationId() == null) {
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_ERROR_NOT_FOUND, "keyInformationId cannot be null");
            }
            KeyInformation keyInformation = keyInformationRepository.findById(createKeyInformationPermissionForm.getKeyInformationId()).orElse(null);
            if (keyInformation == null) {
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_ERROR_NOT_FOUND, "Not found key information");
            }
            if (keyInformationPermissionRepository.findFirstByAccountIdAndKeyInformationId(account.getId(), keyInformation.getId()).isPresent()) {
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_PERMISSION_ERROR_ACCOUNT_AND_KEY_INFORMATION_EXISTED, "Key information permission exists in this account");
            }
            keyInformationPermission.setKeyInformation(keyInformation);
        }
        if (keyInformationPermission.getPermissionKind().equals(FinanceConstant.PERMISSION_KIND_GROUP)) {
            if (createKeyInformationPermissionForm.getKeyInformationGroupId() == null) {
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_GROUP_ERROR_NOT_FOUND, "keyInformationGroupId cannot be null");
            }
            KeyInformationGroup keyInformationGroup = keyInformationGroupRepository.findById(createKeyInformationPermissionForm.getKeyInformationGroupId()).orElse(null);
            if (keyInformationGroup == null) {
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_GROUP_ERROR_NOT_FOUND, "Not found key information group");
            }
            if (keyInformationPermissionRepository.findFirstByAccountIdAndKeyInformationGroupId(account.getId(), keyInformationGroup.getId()).isPresent()) {
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_PERMISSION_ERROR_ACCOUNT_AND_KEY_INFORMATION_GROUP_EXISTED, "Key information group permission exists in this account");
            }
            keyInformationPermission.setKeyInformationGroup(keyInformationGroup);
        }
        keyInformationPermissionRepository.save(keyInformationPermission);
        return makeSuccessResponse(null, "Create key information permission success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('KE_I_P_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateKeyInformationPermissionForm updateKeyInformationPermissionForm, BindingResult bindingResult) {
        KeyInformationPermission keyInformationPermission = keyInformationPermissionRepository.findById(updateKeyInformationPermissionForm.getId()).orElse(null);
        if (keyInformationPermission == null) {
            return makeErrorResponse(ErrorCode.KEY_INFORMATION_PERMISSION_ERROR_NOT_FOUND, "Not found key information permission");
        }
        keyInformationPermission.setPermissionKind(updateKeyInformationPermissionForm.getPermissionKind());
        Account account = accountRepository.findById(updateKeyInformationPermissionForm.getAccountId()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        keyInformationPermission.setAccount(account);
        if (keyInformationPermission.getPermissionKind().equals(FinanceConstant.PERMISSION_KIND_ITEM)) {
            if (updateKeyInformationPermissionForm.getKeyInformationId() == null) {
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_ERROR_NOT_FOUND, "keyInformationId cannot be null");
            }
            KeyInformation keyInformation = keyInformationRepository.findById(updateKeyInformationPermissionForm.getKeyInformationId()).orElse(null);
            if (keyInformation == null) {
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_ERROR_NOT_FOUND, "Not found key information");
            }
            if (keyInformationPermissionRepository.findFirstByAccountIdAndKeyInformationId(account.getId(), keyInformation.getId()).isPresent()) {
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_PERMISSION_ERROR_ACCOUNT_AND_KEY_INFORMATION_EXISTED, "Key information permission exists in this account");
            }
            keyInformationPermission.setKeyInformation(keyInformation);
        } else {
            keyInformationPermission.setKeyInformation(null);
        }
        if (keyInformationPermission.getPermissionKind().equals(FinanceConstant.PERMISSION_KIND_GROUP)) {
            if (updateKeyInformationPermissionForm.getKeyInformationGroupId() == null) {
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_GROUP_ERROR_NOT_FOUND, "keyInformationGroupId cannot be null");
            }
            KeyInformationGroup keyInformationGroup = keyInformationGroupRepository.findById(updateKeyInformationPermissionForm.getKeyInformationGroupId()).orElse(null);
            if (keyInformationGroup == null) {
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_GROUP_ERROR_NOT_FOUND, "Not found key information group");
            }
            if (keyInformationPermissionRepository.findFirstByAccountIdAndKeyInformationGroupId(account.getId(), keyInformationGroup.getId()).isPresent()) {
                return makeErrorResponse(ErrorCode.KEY_INFORMATION_PERMISSION_ERROR_ACCOUNT_AND_KEY_INFORMATION_GROUP_EXISTED, "Key information group permission exists in this account");
            }
            keyInformationPermission.setKeyInformationGroup(keyInformationGroup);
        } else {
            keyInformationPermission.setKeyInformationGroup(null);
        }
        keyInformationPermissionRepository.save(keyInformationPermission);
        return makeSuccessResponse(null, "Update key information permission success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('KE_I_P_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        KeyInformationPermission keyInformationPermission = keyInformationPermissionRepository.findById(id).orElse(null);
        if (keyInformationPermission == null) {
            return makeErrorResponse(ErrorCode.KEY_INFORMATION_PERMISSION_ERROR_NOT_FOUND, "Not found key information permission");
        }
        keyInformationPermissionRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete key information permission success");
    }
}
