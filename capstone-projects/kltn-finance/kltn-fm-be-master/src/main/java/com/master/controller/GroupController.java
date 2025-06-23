package com.master.controller;

import com.master.constant.MasterConstant;
import com.master.exception.BadRequestException;
import com.master.exception.NotFoundException;
import com.master.model.Permission;
import com.master.dto.ApiMessageDto;
import com.master.dto.ErrorCode;
import com.master.dto.ResponseListDto;
import com.master.dto.group.GroupAdminDto;
import com.master.form.group.CreateGroupForm;
import com.master.form.group.UpdateGroupForm;
import com.master.mapper.GroupMapper;
import com.master.model.Group;
import com.master.model.criteria.GroupCriteria;
import com.master.repository.AccountRepository;
import com.master.repository.GroupRepository;
import com.master.repository.PermissionRepository;
import com.master.service.SessionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/group")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class GroupController extends ABasicController {
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private PermissionRepository permissionRepository;
    @Autowired
    private GroupMapper groupMapper;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private SessionService sessionService;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('GR_V')")
    public ApiMessageDto<GroupAdminDto> get(@PathVariable("id") Long id) {
        Group group = groupRepository.findById(id).orElse(null);
        if (group == null) {
            return makeErrorResponse(ErrorCode.GROUP_ERROR_NOT_FOUND, "Not found group");
        }
        return makeSuccessResponse(groupMapper.fromEntityToGroupAdminDto(group), "Get group success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('GR_L')")
    public ApiMessageDto<ResponseListDto<List<GroupAdminDto>>> list(GroupCriteria groupCriteria, Pageable pageable) {
        Page<Group> groups = groupRepository.findAll(groupCriteria.getCriteria(), pageable);
        ResponseListDto<List<GroupAdminDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(groupMapper.fromEntityListToGroupAdminDtoList(groups.getContent()));
        responseListObj.setTotalPages(groups.getTotalPages());
        responseListObj.setTotalElements(groups.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list group success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('GR_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateGroupForm createGroupForm, BindingResult bindingResult) {
        Group groupByName = groupRepository.findFirstByName(createGroupForm.getName()).orElse(null);
        if (groupByName != null) {
            return makeErrorResponse(ErrorCode.GROUP_ERROR_NAME_EXISTED, "Name existed");
        }
        List<Permission> permissions = permissionRepository.findAllByIdInAndKind(createGroupForm.getPermissionIds(), MasterConstant.USER_KIND_ADMIN);
        Group group = groupMapper.fromCreateGroupFormToEntity(createGroupForm);
        group.setPermissions(permissions);
        group.setKind(MasterConstant.USER_KIND_ADMIN);
        groupRepository.save(group);
        return makeSuccessResponse(null, "Create group success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('GR_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateGroupForm updateGroupForm, BindingResult bindingResult) {
        Group group = groupRepository.findById(updateGroupForm.getId()).orElse(null);
        if (group == null) {
            return makeErrorResponse(ErrorCode.GROUP_ERROR_NOT_FOUND, "Not found group");
        }
        if (!group.getName().equals(updateGroupForm.getName())) {
            Group groupByName = groupRepository.findFirstByName(updateGroupForm.getName()).orElse(null);
            if (groupByName != null) {
                return makeErrorResponse(ErrorCode.GROUP_ERROR_NAME_EXISTED, "Name existed");
            }
        }
        Integer kind = MasterConstant.USER_KIND_ADMIN;
        if (!MasterConstant.USER_KIND_ADMIN.equals(group.getKind())) {
            kind = MasterConstant.USER_KIND_CUSTOMER;
        }
        List<Permission> permissions = permissionRepository.findAllByIdInAndKind(updateGroupForm.getPermissionIds(), kind);
        Set<Long> existingPermissionIds = group.getPermissions().stream().map(Permission::getId).collect(Collectors.toSet());
        Set<Long> newPermissionIds = permissions.stream().map(Permission::getId).collect(Collectors.toSet());
        boolean arePermissionChanged = !Objects.equals(existingPermissionIds, newPermissionIds);
        groupMapper.fromUpdateGroupFormToEntity(updateGroupForm, group);
        group.setPermissions(permissions);
        groupRepository.save(group);
        if (arePermissionChanged) {
            sessionService.sendMessageLockAccountByGroup(group);
        }
        return makeSuccessResponse(null, "Update group success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('GR_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Group group = groupRepository.findById(id).orElse(null);
        if (group == null) {
            throw new BadRequestException(ErrorCode.GROUP_ERROR_NOT_FOUND, "Not found group");
        }
        if (!MasterConstant.USER_KIND_ADMIN.equals(group.getKind())) {
            throw new BadRequestException(ErrorCode.GROUP_ERROR_NOT_ALLOW_DELETE, "Not allowed to delete system role");
        }
        if (accountRepository.existsByGroupId(id)) {
            throw new BadRequestException(ErrorCode.GROUP_ERROR_NOT_ALLOW_DELETE, "Account existed with this group");
        }
        permissionRepository.deleteAllPermissionsByGroupId(id);
        group.setPermissions(null);
        groupRepository.save(group);
        groupRepository.deleteById(group.getId());
        return makeSuccessResponse(null, "Delete group success");
    }

    @GetMapping(value = "/employee", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<Group> getRoleEmployee() {
        Group group = groupRepository.findFirstByKind(MasterConstant.USER_KIND_EMPLOYEE).orElse(null);
        if (group == null) {
            throw new NotFoundException(ErrorCode.GROUP_ERROR_NOT_FOUND, "[Group] Group not found");
        }
        List<Permission> permissions = group.getPermissions().stream()
                .sorted(Comparator.comparing(Permission::getCreatedDate))
                .collect(Collectors.toList());
        group.setPermissions(permissions);
        return makeSuccessResponse(group, "Get group employee success.");
    }
}