package com.master.controller;

import com.master.form.permission.CreatePermissionForm;
import com.master.model.Permission;
import com.master.dto.ApiMessageDto;
import com.master.dto.ErrorCode;
import com.master.mapper.PermissionMapper;
import com.master.model.criteria.PermissionCriteria;
import com.master.repository.PermissionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/v1/permission")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
@ApiIgnore
public class PermissionController extends ABasicController{
    @Autowired
    private PermissionRepository permissionRepository;
    @Autowired
    private PermissionMapper permissionMapper;

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PER_L')")
    public ApiMessageDto<List<Permission>> list(PermissionCriteria permissionCriteria) {
        Page<Permission> permissions;
        permissions = permissionRepository.findAll(permissionCriteria.getCriteria(), PageRequest.of(0, Integer.MAX_VALUE, Sort.by(new Sort.Order(Sort.Direction.DESC, "createdDate"))));
        ApiMessageDto<List<Permission>> apiMessageDto = new ApiMessageDto<>();
        apiMessageDto.setData(permissions.getContent());
        apiMessageDto.setMessage("Get list permissions success");
        return apiMessageDto;
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PER_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreatePermissionForm createPermissionForm, BindingResult bindingResult) {
        if (permissionRepository.findFirstByNameAndKind(createPermissionForm.getName(), createPermissionForm.getKind()).isPresent()) {
            return makeErrorResponse(ErrorCode.PERMISSION_ERROR_NAME_EXISTED, "Permission name existed with this kind");
        }
        if (permissionRepository.findFirstByPermissionCodeAndKind(createPermissionForm.getPermissionCode(), createPermissionForm.getKind()).isPresent()) {
            return makeErrorResponse(ErrorCode.PERMISSION_ERROR_PERMISSION_CODE_EXISTED, "Permission code existed");
        }
        Permission permission = permissionMapper.fromCreatePermissionFormToEntity(createPermissionForm);
        permissionRepository.save(permission);
        return makeSuccessResponse(null, "Create permission success");
    }
}
