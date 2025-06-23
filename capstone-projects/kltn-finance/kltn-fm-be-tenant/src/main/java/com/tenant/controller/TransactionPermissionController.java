package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.transactionPermission.TransactionPermissionAdminDto;
import com.tenant.dto.transactionPermission.TransactionPermissionDto;
import com.tenant.form.transactionPermission.CreateTransactionPermissionForm;
import com.tenant.form.transactionPermission.UpdateTransactionPermissionForm;
import com.tenant.mapper.TransactionPermissionMapper;
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
@RequestMapping("/v1/transaction-permission")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class TransactionPermissionController extends ABasicController {
    @Autowired
    private TransactionPermissionRepository transactionPermissionRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private TransactionGroupRepository transactionGroupRepository;
    @Autowired
    private TransactionPermissionMapper transactionPermissionMapper;
    @Autowired
    private KeyService keyService;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TR_P_V')")
    public ApiMessageDto<TransactionPermissionAdminDto> get(@PathVariable("id") Long id) {
        TransactionPermission transactionPermission = transactionPermissionRepository.findById(id).orElse(null);
        if (transactionPermission == null) {
            return makeErrorResponse(ErrorCode.TRANSACTION_PERMISSION_ERROR_NOT_FOUND, "Not found transaction permission");
        }
        return makeSuccessResponse(transactionPermissionMapper.fromEncryptEntityToEncryptTransactionPermissionAdminDto(transactionPermission, keyService.getFinanceKeyWrapper()), "Get transaction permission success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TR_P_L')")
    public ApiMessageDto<ResponseListDto<List<TransactionPermissionAdminDto>>> list(TransactionPermissionCriteria transactionPermissionCriteria, Pageable pageable) {
        if (transactionPermissionCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        Page<TransactionPermission> transactionPermissions = transactionPermissionRepository.findAll(transactionPermissionCriteria.getCriteria(), pageable);
        ResponseListDto<List<TransactionPermissionAdminDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(transactionPermissionMapper.fromEncryptEntityListToEncryptTransactionPermissionAdminDtoList(transactionPermissions.getContent(), keyService.getFinanceKeyWrapper()));
        responseListObj.setTotalPages(transactionPermissions.getTotalPages());
        responseListObj.setTotalElements(transactionPermissions.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list transaction permission success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<TransactionPermissionDto>>> autoComplete(TransactionPermissionCriteria transactionPermissionCriteria) {
        Pageable pageable = transactionPermissionCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_TRUE) ? PageRequest.of(0, 10) : PageRequest.of(0, Integer.MAX_VALUE);
        transactionPermissionCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        Page<TransactionPermission> transactionPermissions = transactionPermissionRepository.findAll(transactionPermissionCriteria.getCriteria(), pageable);
        ResponseListDto<List<TransactionPermissionDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(transactionPermissionMapper.fromEncryptEntityListToEncryptTransactionPermissionDtoList(transactionPermissions.getContent(), keyService.getFinanceKeyWrapper()));
        responseListObj.setTotalPages(transactionPermissions.getTotalPages());
        responseListObj.setTotalElements(transactionPermissions.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list transaction permission success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TR_P_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateTransactionPermissionForm createTransactionPermissionForm, BindingResult bindingResult) {
        TransactionPermission transactionPermission = new TransactionPermission();
        transactionPermission.setPermissionKind(createTransactionPermissionForm.getPermissionKind());
        Account account = accountRepository.findById(createTransactionPermissionForm.getAccountId()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        transactionPermission.setAccount(account);
        if (transactionPermission.getPermissionKind().equals(FinanceConstant.PERMISSION_KIND_ITEM)) {
            if (createTransactionPermissionForm.getTransactionId() == null) {
                return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_FOUND, "transactionId cannot be null");
            }
            Transaction transaction = transactionRepository.findById(createTransactionPermissionForm.getTransactionId()).orElse(null);
            if (transaction == null) {
                return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_FOUND, "Not found transaction");
            }
            if (transactionPermissionRepository.findFirstByAccountIdAndTransactionId(account.getId(), transaction.getId()).isPresent()) {
                return makeErrorResponse(ErrorCode.TRANSACTION_PERMISSION_ERROR_ACCOUNT_AND_TRANSACTION_EXISTED, "Transaction permission exists in this account");
            }
            transactionPermission.setTransaction(transaction);
        }
        if (transactionPermission.getPermissionKind().equals(FinanceConstant.PERMISSION_KIND_GROUP)) {
            if (createTransactionPermissionForm.getTransactionGroupId() == null) {
                return makeErrorResponse(ErrorCode.TRANSACTION_GROUP_ERROR_NOT_FOUND, "transactionGroupId cannot be null");
            }
            TransactionGroup transactionGroup = transactionGroupRepository.findById(createTransactionPermissionForm.getTransactionGroupId()).orElse(null);
            if (transactionGroup == null) {
                return makeErrorResponse(ErrorCode.TRANSACTION_GROUP_ERROR_NOT_FOUND, "Not found transaction group");
            }
            if (transactionPermissionRepository.findFirstByAccountIdAndTransactionGroupId(account.getId(), transactionGroup.getId()).isPresent()) {
                return makeErrorResponse(ErrorCode.TRANSACTION_PERMISSION_ERROR_ACCOUNT_AND_TRANSACTION_GROUP_EXISTED, "Transaction group permission exists in this account");
            }
            transactionPermission.setTransactionGroup(transactionGroup);
        }
        transactionPermissionRepository.save(transactionPermission);
        return makeSuccessResponse(null, "Create transaction permission success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TR_P_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateTransactionPermissionForm updateTransactionPermissionForm, BindingResult bindingResult) {
        TransactionPermission transactionPermission = transactionPermissionRepository.findById(updateTransactionPermissionForm.getId()).orElse(null);
        if (transactionPermission == null) {
            return makeErrorResponse(ErrorCode.TRANSACTION_PERMISSION_ERROR_NOT_FOUND, "Not found transaction permission");
        }
        transactionPermission.setPermissionKind(updateTransactionPermissionForm.getPermissionKind());
        Account account = accountRepository.findById(updateTransactionPermissionForm.getAccountId()).orElse(null);
        if (account == null) {
            return makeErrorResponse(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        transactionPermission.setAccount(account);
        if (transactionPermission.getPermissionKind().equals(FinanceConstant.PERMISSION_KIND_ITEM)) {
            if (updateTransactionPermissionForm.getTransactionId() == null) {
                return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_FOUND, "transactionId cannot be null");
            }
            Transaction transaction = transactionRepository.findById(updateTransactionPermissionForm.getTransactionId()).orElse(null);
            if (transaction == null) {
                return makeErrorResponse(ErrorCode.TRANSACTION_ERROR_NOT_FOUND, "Not found transaction");
            }
            if (transactionPermissionRepository.findFirstByAccountIdAndTransactionId(account.getId(), transaction.getId()).isPresent()) {
                return makeErrorResponse(ErrorCode.TRANSACTION_PERMISSION_ERROR_ACCOUNT_AND_TRANSACTION_EXISTED, "Transaction permission exists in this account");
            }
            transactionPermission.setTransaction(transaction);
        } else {
            transactionPermission.setTransaction(null);
        }
        if (transactionPermission.getPermissionKind().equals(FinanceConstant.PERMISSION_KIND_GROUP)) {
            if (updateTransactionPermissionForm.getTransactionGroupId() == null) {
                return makeErrorResponse(ErrorCode.TRANSACTION_GROUP_ERROR_NOT_FOUND, "transactionGroupId cannot be null");
            }
            TransactionGroup transactionGroup = transactionGroupRepository.findById(updateTransactionPermissionForm.getTransactionGroupId()).orElse(null);
            if (transactionGroup == null) {
                return makeErrorResponse(ErrorCode.TRANSACTION_GROUP_ERROR_NOT_FOUND, "Not found transaction group");
            }
            if (transactionPermissionRepository.findFirstByAccountIdAndTransactionGroupId(account.getId(), transactionGroup.getId()).isPresent()) {
                return makeErrorResponse(ErrorCode.TRANSACTION_PERMISSION_ERROR_ACCOUNT_AND_TRANSACTION_GROUP_EXISTED, "Transaction group permission exists in this account");
            }
            transactionPermission.setTransactionGroup(transactionGroup);
        } else {
            transactionPermission.setTransactionGroup(null);
        }
        transactionPermissionRepository.save(transactionPermission);
        return makeSuccessResponse(null, "Update transaction permission success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('TR_P_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        TransactionPermission transactionPermission = transactionPermissionRepository.findById(id).orElse(null);
        if (transactionPermission == null) {
            return makeErrorResponse(ErrorCode.TRANSACTION_PERMISSION_ERROR_NOT_FOUND, "Not found transaction permission");
        }
        transactionPermissionRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete transaction permission success");
    }
}