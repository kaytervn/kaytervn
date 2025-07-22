package com.msa.controller;

import com.msa.cache.SessionService;
import com.msa.constant.AppConstant;
import com.msa.constant.ErrorCode;
import com.msa.constant.SecurityConstant;
import com.msa.dto.ApiMessageDto;
import com.msa.dto.ResponseListDto;
import com.msa.dto.group.GroupDto;
import com.msa.exception.BadRequestException;
import com.msa.form.group.CreateGroupForm;
import com.msa.form.group.UpdateGroupForm;
import com.msa.mapper.GroupMapper;
import com.msa.storage.master.model.Group;
import com.msa.storage.master.model.Permission;
import com.msa.storage.master.model.criteria.GroupCriteria;
import com.msa.storage.master.repository.GroupRepository;
import com.msa.storage.master.repository.PermissionRepository;
import com.msa.storage.master.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
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
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/v1/group")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class GroupController extends ABasicController {
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private PermissionRepository permissionRepository;
    @Autowired
    private GroupMapper groupMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SessionService sessionService;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('GR_V')")
    public ApiMessageDto<GroupDto> get(@PathVariable("id") Long id) {
        Group group = groupRepository.findFirstByIdAndIsSystem(id, Boolean.FALSE).orElse(null);
        if (group == null) {
            throw new BadRequestException(ErrorCode.GROUP_ERROR_NOT_FOUND, "Not found group");
        }
        return makeSuccessResponse(groupMapper.fromEntityToGroupDto(group), "Get group success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('GR_L')")
    public ApiMessageDto<ResponseListDto<List<GroupDto>>> list(GroupCriteria groupCriteria, Pageable pageable) {
        Page<Group> listGroup = groupRepository.findAll(groupCriteria.getCriteria(), pageable);
        ResponseListDto<List<GroupDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(groupMapper.fromEntityListToGroupDtoList(listGroup.getContent()));
        responseListObj.setTotalPages(listGroup.getTotalPages());
        responseListObj.setTotalElements(listGroup.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list group success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<GroupDto>>> autoComplete(GroupCriteria groupCriteria, @PageableDefault Pageable pageable) {
        groupCriteria.setStatus(AppConstant.STATUS_ACTIVE);
        groupCriteria.setIsSystem(Boolean.FALSE);
        Page<Group> listGroup = groupRepository.findAll(groupCriteria.getCriteria(), pageable);
        ResponseListDto<List<GroupDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(groupMapper.fromEntityListToGroupDtoListAutoComplete(listGroup.getContent()));
        responseListObj.setTotalPages(listGroup.getTotalPages());
        responseListObj.setTotalElements(listGroup.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list auto-complete group success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('GR_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody CreateGroupForm form, BindingResult bindingResult) {
        if (groupRepository.existsByName(form.getName())) {
            throw new BadRequestException(ErrorCode.GROUP_ERROR_NAME_EXISTED, "Name existed");
        }
        Integer kind = SecurityConstant.USER_KIND_USER;
        List<Permission> permissions = permissionRepository.findAllByIdInAndKind(form.getPermissionIds(), kind);
        Group group = groupMapper.fromCreateGroupFormToEntity(form);
        group.setPermissions(permissions);
        group.setKind(kind);
        groupRepository.save(group);
        return makeSuccessResponse(null, "Create group success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('GR_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateGroupForm form, BindingResult bindingResult) {
        Group group = groupRepository.findFirstByIdAndIsSystem(form.getId(), Boolean.FALSE).orElse(null);
        if (group == null) {
            throw new BadRequestException(ErrorCode.GROUP_ERROR_NOT_FOUND, "Not found group");
        }
        if (groupRepository.existsByNameAndIdNot(form.getName(), group.getId())) {
            throw new BadRequestException(ErrorCode.GROUP_ERROR_NAME_EXISTED, "Name existed");
        }
        Integer kind = SecurityConstant.USER_KIND_ADMIN;
        if (!SecurityConstant.USER_KIND_ADMIN.equals(group.getKind())) {
            kind = SecurityConstant.USER_KIND_USER;
        }
        List<Permission> permissions = permissionRepository.findAllByIdInAndKind(form.getPermissionIds(), kind);
        Set<Long> existingPermissionIds = group.getPermissions().stream().map(Permission::getId).collect(Collectors.toSet());
        Set<Long> newPermissionIds = permissions.stream().map(Permission::getId).collect(Collectors.toSet());
        boolean arePermissionChanged = !Objects.equals(existingPermissionIds, newPermissionIds);
        groupMapper.fromUpdateGroupFormToEntity(form, group);
        group.setPermissions(permissions);
        groupRepository.save(group);
        if (arePermissionChanged) {
            sessionService.sendMessageLockUsersByGroupId(group.getId());
        }
        return makeSuccessResponse(null, "Update group success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('GR_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Group group = groupRepository.findFirstByIdAndKindAndIsSystem(id, SecurityConstant.USER_KIND_USER, Boolean.FALSE).orElse(null);
        if (group == null) {
            throw new BadRequestException(ErrorCode.GROUP_ERROR_NOT_FOUND, "Not found group");
        }
        if (userRepository.existsByGroupId(id)) {
            throw new BadRequestException(ErrorCode.GROUP_ERROR_NOT_ALLOW_DELETE, "User existed with this group");
        }
        groupRepository.deleteById(id);
        return makeSuccessResponse(null, "Delete group success");
    }
}