package com.msa.controller;

import com.msa.constant.AppConstant;
import com.msa.constant.ErrorCode;
import com.msa.dto.ApiMessageDto;
import com.msa.dto.ResponseListDto;
import com.msa.dto.account.AccountDto;
import com.msa.exception.BadRequestException;
import com.msa.form.account.CreateAccountForm;
import com.msa.form.account.UpdateAccountForm;
import com.msa.mapper.AccountMapper;
import com.msa.service.encryption.EncryptionService;
import com.msa.storage.tenant.model.Account;
import com.msa.storage.tenant.model.Platform;
import com.msa.storage.tenant.model.criteria.AccountCriteria;
import com.msa.storage.tenant.repository.AccountRepository;
import com.msa.storage.tenant.repository.BackupCodeRepository;
import com.msa.storage.tenant.repository.PlatformRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/v1/account")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AccountController extends ABasicController {
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private PlatformRepository platformRepository;
    @Autowired
    private EncryptionService encryptionService;
    @Autowired
    private BackupCodeRepository backupCodeRepository;

    private void updatePlatformTotalAccounts(Long platformId) {
        Integer count = accountRepository.countByPlatformId(platformId);
        platformRepository.updateTotalAccounts(platformId, count);
    }

    private void updateAccountTotalChildren(Long accountId) {
        Integer count = accountRepository.countByParentId(accountId);
        accountRepository.updateTotalChildren(accountId, count);
    }

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ACC_V')")
    public ApiMessageDto<AccountDto> get(@PathVariable("id") Long id) {
        Account account = accountRepository.findById(id).orElse(null);
        if (account == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        return makeSuccessResponse(accountMapper.fromEntityToAccountDto(account, encryptionService.getServerKeyWrapper()), "Get account success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ACC_L')")
    public ApiMessageDto<ResponseListDto<List<AccountDto>>> list(AccountCriteria accountCriteria, Pageable pageable) {
        Page<Account> listAccount = accountRepository.findAll(accountCriteria.getCriteria(), pageable);
        ResponseListDto<List<AccountDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(accountMapper.fromEntityListToAccountDtoList(listAccount.getContent(), encryptionService.getServerKeyWrapper()));
        responseListObj.setTotalPages(listAccount.getTotalPages());
        responseListObj.setTotalElements(listAccount.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list account success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<AccountDto>>> autoComplete(AccountCriteria accountCriteria, @PageableDefault Pageable pageable) {
        accountCriteria.setStatus(AppConstant.STATUS_ACTIVE);
        Page<Account> listAccount = accountRepository.findAll(accountCriteria.getCriteria(), pageable);
        ResponseListDto<List<AccountDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(accountMapper.fromEntityListToAccountDtoListAutoComplete(listAccount.getContent()));
        responseListObj.setTotalPages(listAccount.getTotalPages());
        responseListObj.setTotalElements(listAccount.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list auto-complete account success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ACC_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateAccountForm form, BindingResult bindingResult) {
        String password = encryptionService.userDecrypt(form.getPassword());
        if (AppConstant.ACCOUNT_KIND_ROOT.equals(form.getKind())) {
            if (StringUtils.isBlank(form.getUsername()) || StringUtils.isBlank(password)) {
                throw new BadRequestException("Username and password are required");
            }
        } else if (form.getParentId() == null) {
            throw new BadRequestException("Parent id is required");
        }
        Account account = accountMapper.fromCreateAccountFormToEntity(form);
        Platform platform = platformRepository.findById(form.getPlatformId()).orElse(null);
        if (platform == null) {
            throw new BadRequestException(ErrorCode.PLATFORM_ERROR_NOT_FOUND, "Not found platform");
        }
        account.setPlatform(platform);
        if (AppConstant.ACCOUNT_KIND_ROOT.equals(form.getKind())) {
            if (accountRepository.existsByUsernameAndPlatformId(account.getUsername(), platform.getId())) {
                throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_RECORD_EXISTED, "Username existed with this platform");
            }
            account.setUsername(form.getUsername());
            account.setPassword(encryptionService.serverEncrypt(password));
            accountRepository.save(account);
        } else {
            Account parent = accountRepository.findById(form.getParentId()).orElse(null);
            if (parent == null) {
                throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found parent");
            }
            if (accountRepository.existsByParentIdAndPlatformId(parent.getId(), platform.getId())) {
                throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_RECORD_EXISTED, "Link account existed with this platform");
            }
            account.setParent(parent);
            accountRepository.save(account);
            updateAccountTotalChildren(parent.getId());
        }
        updatePlatformTotalAccounts(platform.getId());
        return makeSuccessResponse(null, "Create account success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ACC_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateAccountForm form, BindingResult bindingResult) {
        String password = encryptionService.userDecrypt(form.getPassword());
        Account account = accountRepository.findById(form.getId()).orElse(null);
        if (account == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        if (AppConstant.ACCOUNT_KIND_ROOT.equals(account.getKind()) &&
                (StringUtils.isBlank(form.getUsername()) || StringUtils.isBlank(password))) {
            throw new BadRequestException("Username and password are required");
        }
        accountMapper.fromUpdateAccountFormToEntity(form, account);
        Platform platform = platformRepository.findById(form.getPlatformId()).orElse(null);
        if (platform == null) {
            throw new BadRequestException(ErrorCode.PLATFORM_ERROR_NOT_FOUND, "Not found platform");
        }
        Long oldPlatformId = account.getPlatform().getId();
        Long newPlatformId = platform.getId();
        boolean isPlatformChanged = !oldPlatformId.equals(newPlatformId);
        account.setPlatform(platform);
        if (AppConstant.ACCOUNT_KIND_ROOT.equals(account.getKind())) {
            if (isPlatformChanged && accountRepository.existsByUsernameAndPlatformId(account.getUsername(), platform.getId())) {
                throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_RECORD_EXISTED, "Username existed with this platform");
            }
            account.setUsername(form.getUsername());
            account.setPassword(encryptionService.serverEncrypt(password));

        } else if (isPlatformChanged && accountRepository.existsByParentIdAndPlatformId(account.getParent().getId(), platform.getId())) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_RECORD_EXISTED, "Link account existed with this platform");
        }
        accountRepository.save(account);
        if (isPlatformChanged) {
            updatePlatformTotalAccounts(oldPlatformId);
            updatePlatformTotalAccounts(newPlatformId);
        }
        return makeSuccessResponse(null, "Update account success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ACC_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Account account = accountRepository.findById(id).orElse(null);
        if (account == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        if (accountRepository.existsByParentId(id)) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_CHILDREN_EXISTED, "Link account existed");
        }
        backupCodeRepository.deleteAllByAccountId(id);
        accountRepository.deleteById(id);
        if (AppConstant.ACCOUNT_KIND_LINK.equals(account.getKind())) {
            updateAccountTotalChildren(account.getParent().getId());
        }
        updatePlatformTotalAccounts(account.getPlatform().getId());
        return makeSuccessResponse(null, "Delete account success");
    }
}