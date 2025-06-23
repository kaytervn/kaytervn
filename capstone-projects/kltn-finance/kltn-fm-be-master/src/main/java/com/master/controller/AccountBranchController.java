package com.master.controller;

import com.master.dto.ApiMessageDto;
import com.master.dto.ErrorCode;
import com.master.dto.ResponseListDto;
import com.master.dto.accountBranch.AccountBranchDto;
import com.master.exception.BadRequestException;
import com.master.form.accountBranch.CreateAccountBranchForm;
import com.master.mapper.AccountBranchMapper;
import com.master.model.Account;
import com.master.model.AccountBranch;
import com.master.model.Branch;
import com.master.model.criteria.AccountBranchCriteria;
import com.master.repository.AccountBranchRepository;
import com.master.repository.AccountRepository;
import com.master.repository.BranchRepository;
import lombok.extern.slf4j.Slf4j;
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
@RequestMapping("/v1/account-branch")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AccountBranchController extends ABasicController {
    @Autowired
    private AccountBranchRepository accountBranchRepository;
    @Autowired
    private AccountBranchMapper accountBranchMapper;
    @Autowired
    private BranchRepository branchRepository;
    @Autowired
    private AccountRepository accountRepository;

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ACC_B_L')")
    public ApiMessageDto<ResponseListDto<List<AccountBranchDto>>> list(AccountBranchCriteria accountBranchCriteria, Pageable pageable) {
        Page<AccountBranch> listAccountBranch = accountBranchRepository.findAll(accountBranchCriteria.getCriteria(), pageable);
        ResponseListDto<List<AccountBranchDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(accountBranchMapper.fromEntityListToAccountBranchDtoList(listAccountBranch.getContent()));
        responseListObj.setTotalPages(listAccountBranch.getTotalPages());
        responseListObj.setTotalElements(listAccountBranch.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list account branch success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ACC_B_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateAccountBranchForm form, BindingResult bindingResult) {
        AccountBranch accountBranch = new AccountBranch();
        Branch branch = branchRepository.findById(form.getBranchId()).orElse(null);
        if (branch == null) {
            throw new BadRequestException(ErrorCode.BRANCH_ERROR_NOT_FOUND, "Not found branch");
        }
        accountBranch.setBranch(branch);
        Account account = accountRepository.findById(form.getAccountId()).orElse(null);
        if (account == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        accountBranch.setAccount(account);
        if (accountBranchRepository.existsByAccountIdAndBranchId(account.getId(), branch.getId())) {
            throw new BadRequestException(ErrorCode.ACCOUNT_BRANCH_ERROR_EXISTED, "Account branch existed");
        }
        accountBranchRepository.save(accountBranch);
        return makeSuccessResponse(null, "Create account branch success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ACC_B_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        AccountBranch accountBranch = accountBranchRepository.findById(id).orElse(null);
        if (accountBranch == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_BRANCH_ERROR_NOT_FOUND, "Not found account branch");
        }
        accountBranchRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete account branch success");
    }
}
