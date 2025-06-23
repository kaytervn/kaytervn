package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.department.DepartmentAdminDto;
import com.tenant.dto.department.DepartmentDto;
import com.tenant.exception.BadRequestException;
import com.tenant.form.department.CreateDepartmentForm;
import com.tenant.form.department.UpdateDepartmentForm;
import com.tenant.mapper.DepartmentMapper;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.model.criteria.*;
import com.tenant.storage.tenant.repository.*;
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
@RequestMapping("/v1/department")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class DepartmentController extends ABasicController{
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private DepartmentMapper departmentMapper;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('DE_V')")
    public ApiMessageDto<DepartmentAdminDto> get(@PathVariable("id") Long id) {
        Department department = departmentRepository.findById(id).orElse(null);
        if(department == null){
            return makeErrorResponse(ErrorCode.DEPARTMENT_ERROR_NOT_FOUND, "Not found department");
        }
        return makeSuccessResponse(departmentMapper.fromEntityToDepartmentAdminDto(department), "Get department success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('DE_L')")
    public ApiMessageDto<ResponseListDto<List<DepartmentAdminDto>>> list(DepartmentCriteria departmentCriteria, Pageable pageable) {
        Page<Department> departments = departmentRepository.findAll(departmentCriteria.getCriteria(), pageable);
        ResponseListDto<List<DepartmentAdminDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(departmentMapper.fromEntityListToDepartmentAdminDtoList(departments.getContent()));
        responseListObj.setTotalPages(departments.getTotalPages());
        responseListObj.setTotalElements(departments.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list department success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<DepartmentDto>>> autoComplete(DepartmentCriteria departmentCriteria) {
        Pageable pageable = PageRequest.of(0,10);
        departmentCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        Page<Department> departments = departmentRepository.findAll(departmentCriteria.getCriteria(), pageable);
        ResponseListDto<List<DepartmentDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(departmentMapper.fromEntityListToDepartmentDtoList(departments.getContent()));
        responseListObj.setTotalPages(departments.getTotalPages());
        responseListObj.setTotalElements(departments.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list department success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('DE_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateDepartmentForm createDepartmentForm, BindingResult bindingResult) {
        Department departmentByName = departmentRepository.findFirstByName(createDepartmentForm.getName()).orElse(null);
        if(departmentByName != null){
            return makeErrorResponse(ErrorCode.DEPARTMENT_ERROR_NAME_EXISTED, "Name existed");
        }
        Department department = departmentMapper.fromCreateDepartmentFormToEntity(createDepartmentForm);
        departmentRepository.save(department);
        return makeSuccessResponse(null, "Create department success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('DE_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateDepartmentForm updateDepartmentForm, BindingResult bindingResult) {
        Department department = departmentRepository.findById(updateDepartmentForm.getId()).orElse(null);
        if (department == null){
            return makeErrorResponse(ErrorCode.DEPARTMENT_ERROR_NOT_FOUND, "Not found department");
        }
        if(!department.getName().equals(updateDepartmentForm.getName())){
            Department departmentByName = departmentRepository.findFirstByName(updateDepartmentForm.getName()).orElse(null);
            if(departmentByName != null){
                return makeErrorResponse(ErrorCode.DEPARTMENT_ERROR_NAME_EXISTED, "Name existed");
            }
        }
        departmentMapper.fromUpdateDepartmentFormToEntity(updateDepartmentForm, department);
        departmentRepository.save(department);
        return makeSuccessResponse(null, "Update department success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('DE_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Department department = departmentRepository.findById(id).orElse(null);
        if (department == null) {
            return makeErrorResponse(ErrorCode.DEPARTMENT_ERROR_NOT_FOUND, "Not found department");
        }
        if (accountRepository.existsByDepartmentId(id)) {
            throw new BadRequestException(ErrorCode.GENERAL_ERROR_NOT_ALLOWED_DELETE, "Account existed with this department");
        }
        departmentRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete department success");
    }
}
