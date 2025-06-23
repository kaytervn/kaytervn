package com.tenant.controller;

import com.tenant.cache.SessionService;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.group.GroupAdminDto;
import com.tenant.form.group.CreateGroupForm;
import com.tenant.form.group.UpdateGroupForm;
import com.tenant.mapper.GroupMapper;
import com.tenant.multitenancy.feign.FeignDbConfigAuthService;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.model.criteria.*;
import com.tenant.storage.tenant.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/group")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class GroupController extends ABasicController{
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private GroupMapper groupMapper;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private FeignDbConfigAuthService feignDbConfigAuthService;
    @Value("${master.api-key}")
    private String masterApiKey;
    @Autowired
    private GroupPermissionRepository groupPermissionRepository;
    @Autowired
    private SessionService sessionService;

    @GetMapping(value = "/get/{id}", produces= MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('RO_V')")
    public ApiMessageDto<GroupAdminDto> get(@PathVariable("id")  Long id) {
        Group group = groupRepository.findById(id).orElse(null);
        if (group == null){
            return makeErrorResponse(ErrorCode.GROUP_ERROR_NOT_FOUND, "Not found group");
        }
        GroupAdminDto dto = groupMapper.fromEntityToGroupAdminDto(group);
        dto.setRole(feignDbConfigAuthService.getRoleEmployee(masterApiKey).getData());
        return makeSuccessResponse(dto, "Get group success");
    }

    @GetMapping(value = "/list", produces= MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('RO_L')")
    public ApiMessageDto<ResponseListDto<List<GroupAdminDto>>> list(GroupCriteria groupCriteria, Pageable pageable) {
        Page<Group> groups = groupRepository.findAll(groupCriteria.getCriteria(), pageable);
        ResponseListDto<List<GroupAdminDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(groupMapper.fromEntityListToGroupAdminDtoList(groups.getContent()));
        responseListObj.setTotalPages(groups.getTotalPages());
        responseListObj.setTotalElements(groups.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list group success");
    }

    @PostMapping(value = "/create", produces= MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('RO_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateGroupForm createGroupForm, BindingResult bindingResult) {
        Group groupByName = groupRepository.findFirstByName(createGroupForm.getName()).orElse(null);
        if (groupByName != null) {
            return makeErrorResponse(ErrorCode.GROUP_ERROR_NAME_EXISTED, "Name existed");
        }
        Group group = groupMapper.fromCreateGroupFormToEntity(createGroupForm);
        groupRepository.save(group);
        List<GroupPermission> groupPermissions = new ArrayList<>();
        for (long permissionId : createGroupForm.getPermissionIds()) {
            GroupPermission groupPermission = new GroupPermission();
            groupPermission.setGroup(group);
            groupPermission.setPermissionId(permissionId);
            groupPermissions.add(groupPermission);
        }
        if (!groupPermissions.isEmpty()) {
            groupPermissionRepository.saveAll(groupPermissions);
        }
        return makeSuccessResponse(null, "Create group success");
    }

    @PutMapping(value = "/update", produces= MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('RO_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateGroupForm updateGroupForm, BindingResult bindingResult) {
        Group group = groupRepository.findById(updateGroupForm.getId()).orElse(null);
        if(group == null){
            return makeErrorResponse(ErrorCode.GROUP_ERROR_NOT_FOUND, "Not found group");
        }
        if (!group.getName().equals(updateGroupForm.getName())){
            Group groupByName = groupRepository.findFirstByName(updateGroupForm.getName()).orElse(null);
            if(groupByName != null){
                return makeErrorResponse(ErrorCode.GROUP_ERROR_NAME_EXISTED, "Name existed");
            }
        }
        groupMapper.fromUpdateGroupFormToEntity(updateGroupForm, group);
        Set<Long> existingPermissionIds = new HashSet<>(groupPermissionRepository.findAllPermissionIdsByGroupId(group.getId()));
        Set<Long> newPermissionIds = new HashSet<>(updateGroupForm.getPermissionIds());
        boolean arePermissionChanged = !Objects.equals(existingPermissionIds, newPermissionIds);
        List<GroupPermission> groupPermissions = new ArrayList<>();
        for (long permissionId : updateGroupForm.getPermissionIds()) {
            GroupPermission groupPermission = new GroupPermission();
            groupPermission.setGroup(group);
            groupPermission.setPermissionId(permissionId);
            groupPermissions.add(groupPermission);
        }
        groupPermissionRepository.deleteAllByGroupId(group.getId());
        groupPermissionRepository.saveAll(groupPermissions);
        group.setGroupPermissions(groupPermissions);
        groupRepository.save(group);
        if (arePermissionChanged) {
            sessionService.sendMessageLockAccountByGroup(group);
        }
        return makeSuccessResponse(null, "Update group success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('RO_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Group group = groupRepository.findById(id).orElse(null);
        if (group == null) {
            return makeErrorResponse(ErrorCode.GROUP_ERROR_NOT_FOUND, "Not found group");
        }
        if (accountRepository.existsByGroupId(id)) {
            return makeErrorResponse(ErrorCode.GROUP_ERROR_NOT_ALLOW_DELETE, "Not allowed to delete group");
        }
        groupPermissionRepository.deleteAllByGroupId(id);
        group.setGroupPermissions(null);
        groupRepository.save(group);
        groupRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete group success");
    }

    @GetMapping(value = "/employee", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('RO_C')")
    public ApiMessageDto<Object> getRoleEmployee() {
        return feignDbConfigAuthService.getRoleEmployee(masterApiKey);
    }
}
