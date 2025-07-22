package com.msa.controller;

import com.msa.constant.ErrorCode;
import com.msa.dto.ApiMessageDto;
import com.msa.dto.ResponseListDto;
import com.msa.dto.backupCode.BackupCodeDto;
import com.msa.exception.BadRequestException;
import com.msa.form.backupCode.CreateBackupCodeForm;
import com.msa.mapper.BackupCodeMapper;
import com.msa.service.encryption.EncryptionService;
import com.msa.storage.tenant.model.Account;
import com.msa.storage.tenant.model.BackupCode;
import com.msa.storage.tenant.model.criteria.BackupCodeCriteria;
import com.msa.storage.tenant.repository.AccountRepository;
import com.msa.storage.tenant.repository.BackupCodeRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/v1/backup-code")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BackupCodeController extends ABasicController {
    @Autowired
    private BackupCodeRepository backupCodeRepository;
    @Autowired
    private BackupCodeMapper backupCodeMapper;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private EncryptionService encryptionService;

    private void updateAccountTotalBackupCode(Long accountId) {
        Integer count = backupCodeRepository.countByAccountId(accountId);
        accountRepository.updateTotalBackupCodes(accountId, count);
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('BA_C_L')")
    public ApiMessageDto<ResponseListDto<List<BackupCodeDto>>> list(BackupCodeCriteria backupCodeCriteria, Pageable pageable) {
        Page<BackupCode> listBackupCode = backupCodeRepository.findAll(backupCodeCriteria.getCriteria(), pageable);
        ResponseListDto<List<BackupCodeDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(backupCodeMapper.fromEntityListToBackupCodeDtoList(listBackupCode.getContent(), encryptionService.getServerKeyWrapper()));
        responseListObj.setTotalPages(listBackupCode.getTotalPages());
        responseListObj.setTotalElements(listBackupCode.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list backup code success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('BA_C_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateBackupCodeForm form, BindingResult bindingResult) {
        String code = encryptionService.userDecrypt(form.getCode());
        if (StringUtils.isBlank(code)) {
            throw new BadRequestException("Code is required");
        }
        BackupCode backupCode = new BackupCode();
        backupCode.setCode(encryptionService.serverEncrypt(code));
        Account account = accountRepository.findById(form.getAccountId()).orElse(null);
        if (account == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        if (backupCodeRepository.existsByAccountIdAndCode(account.getId(), backupCode.getCode())) {
            throw new BadRequestException(ErrorCode.BACKUP_CODE_ERROR_CODE_EXISTED, "Code existed");
        }
        backupCode.setAccount(account);
        backupCodeRepository.save(backupCode);
        updateAccountTotalBackupCode(account.getId());
        return makeSuccessResponse(null, "Create backup code success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('BA_C_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        BackupCode backupCode = backupCodeRepository.findById(id).orElse(null);
        if (backupCode == null) {
            throw new BadRequestException(ErrorCode.BACKUP_CODE_ERROR_NOT_FOUND, "Not found backup code");
        }
        backupCodeRepository.deleteById(id);
        updateAccountTotalBackupCode(backupCode.getAccount().getId());
        return makeSuccessResponse(null, "Delete backup code success");
    }
}
