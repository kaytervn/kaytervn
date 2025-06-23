package com.master.controller;

import com.master.constant.MasterConstant;
import com.master.dto.ApiMessageDto;
import com.master.dto.ErrorCode;
import com.master.dto.ResponseListDto;
import com.master.dto.branch.BranchDto;
import com.master.exception.BadRequestException;
import com.master.form.branch.CreateBranchForm;
import com.master.form.branch.UpdateBranchForm;
import com.master.mapper.BranchMapper;
import com.master.model.Branch;
import com.master.model.criteria.BranchCriteria;
import com.master.repository.AccountBranchRepository;
import com.master.repository.BranchRepository;
import com.master.repository.CustomerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/v1/branch")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BranchController extends ABasicController {
    @Autowired
    private BranchRepository branchRepository;
    @Autowired
    private BranchMapper branchMapper;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private AccountBranchRepository accountBranchRepository;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('BR_V')")
    public ApiMessageDto<BranchDto> get(@PathVariable("id") Long id) {
        Branch branch = branchRepository.findById(id).orElse(null);
        if (branch == null) {
            throw new BadRequestException(ErrorCode.BRANCH_ERROR_NOT_FOUND, "Not found branch");
        }
        return makeSuccessResponse(branchMapper.fromEntityToBranchDto(branch), "Get branch success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('BR_L')")
    public ApiMessageDto<ResponseListDto<List<BranchDto>>> list(BranchCriteria branchCriteria, Pageable pageable) {
        if (!isSuperAdmin()) {
            branchCriteria.setPermissionAccountId(getCurrentUser());
        }
        if (MasterConstant.BOOLEAN_FALSE.equals(branchCriteria.getIsPaged())) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by("createdDate").descending());
        } else {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("createdDate").descending());
        }
        Page<Branch> listBranch = branchRepository.findAll(branchCriteria.getCriteria(), pageable);
        ResponseListDto<List<BranchDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(branchMapper.fromEntityListToBranchDtoList(listBranch.getContent()));
        responseListObj.setTotalPages(listBranch.getTotalPages());
        responseListObj.setTotalElements(listBranch.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list branch success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<BranchDto>>> autoComplete(BranchCriteria branchCriteria, @PageableDefault Pageable pageable) {
        if (!isSuperAdmin()) {
            branchCriteria.setPermissionAccountId(getCurrentUser());
        }
        if (MasterConstant.BOOLEAN_FALSE.equals(branchCriteria.getIsPaged())) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by("createdDate").descending());
        } else {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("createdDate").descending());
        }
        branchCriteria.setStatus(MasterConstant.STATUS_ACTIVE);
        Page<Branch> listBranch = branchRepository.findAll(branchCriteria.getCriteria(), pageable);
        ResponseListDto<List<BranchDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(branchMapper.fromEntityListToBranchDtoListAutoComplete(listBranch.getContent()));
        responseListObj.setTotalPages(listBranch.getTotalPages());
        responseListObj.setTotalElements(listBranch.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list auto-complete branch success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('BR_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateBranchForm form, BindingResult bindingResult) {
        Branch branch = branchMapper.fromCreateBranchFormToEntity(form);
        branchRepository.save(branch);
        return makeSuccessResponse(null, "Create branch success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('BR_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateBranchForm form, BindingResult bindingResult) {
        Branch branch = branchRepository.findById(form.getId()).orElse(null);
        if (branch == null) {
            throw new BadRequestException(ErrorCode.BRANCH_ERROR_NOT_FOUND, "Not found branch");
        }
        branchMapper.fromUpdateBranchFormToEntity(form, branch);
        branchRepository.save(branch);
        return makeSuccessResponse(null, "Update branch success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('BR_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Branch branch = branchRepository.findById(id).orElse(null);
        if (branch == null) {
            throw new BadRequestException(ErrorCode.BRANCH_ERROR_NOT_FOUND, "Not found branch");
        }
        if (accountBranchRepository.existsByBranchId(id)) {
            throw new BadRequestException(ErrorCode.BRANCH_ERROR_ACCOUNT_EXISTED, "Accounts existed with this branch");
        }
        if (customerRepository.existsByBranchId(id)) {
            throw new BadRequestException(ErrorCode.BRANCH_ERROR_CUSTOMER_EXISTED, "Customers existed with this branch");
        }
        branchRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete branch success");
    }
}