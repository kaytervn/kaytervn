package com.msa.controller;

import com.msa.component.AuditLogAnnotation;
import com.msa.constant.AppConstant;
import com.msa.constant.ErrorCode;
import com.msa.dto.ApiMessageDto;
import com.msa.dto.ResponseListDto;
import com.msa.dto.permission.PermissionDto;
import com.msa.exception.BadRequestException;
import com.msa.form.permission.CreatePermissionForm;
import com.msa.mapper.PermissionMapper;
import com.msa.storage.master.model.Permission;
import com.msa.storage.master.model.criteria.PermissionCriteria;
import com.msa.storage.master.repository.PermissionRepository;
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

@Slf4j
@RestController
@RequestMapping("/v1/permission")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PermissionController extends ABasicController {
    @Autowired
    private PermissionRepository permissionRepository;
    @Autowired
    private PermissionMapper permissionMapper;

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PER_L')")
    public ApiMessageDto<ResponseListDto<List<PermissionDto>>> list(PermissionCriteria permissionCriteria, Pageable pageable) {
        if (AppConstant.BOOLEAN_FALSE.equals(permissionCriteria.getIsPaged())) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        } else {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
        }
        Page<Permission> listPermission = permissionRepository.findAll(permissionCriteria.getCriteria(), pageable);
        ResponseListDto<List<PermissionDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(permissionMapper.fromEntityListToPermissionDtoList(listPermission.getContent()));
        responseListObj.setTotalPages(listPermission.getTotalPages());
        responseListObj.setTotalElements(listPermission.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list permission success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PER_C')")
    @AuditLogAnnotation()
    public ApiMessageDto<String> create(@Valid @RequestBody CreatePermissionForm form, BindingResult bindingResult) {
        if (permissionRepository.existsByPermissionCode(form.getPermissionCode())) {
            throw new BadRequestException(ErrorCode.PERMISSION_ERROR_PERMISSION_CODE_EXISTED, "Permission code existed");
        }
        if (permissionRepository.existsByNameAndNameGroup(form.getName(), form.getNameGroup())) {
            throw new BadRequestException(ErrorCode.PERMISSION_ERROR_NAME_EXISTED, "Name existed");
        }
        Permission permission = permissionMapper.fromCreatePermissionFormToEntity(form);
        permissionRepository.save(permission);
        return makeSuccessResponse(null, "Create permission success");
    }
}
