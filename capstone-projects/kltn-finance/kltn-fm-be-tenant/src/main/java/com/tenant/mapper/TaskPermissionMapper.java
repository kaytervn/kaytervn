package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.taskPermission.TaskPermissionAdminDto;
import com.tenant.dto.taskPermission.TaskPermissionDto;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {AccountMapper.class, TaskMapper.class, ProjectMapper.class})
public interface TaskPermissionMapper extends EncryptDecryptMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "permissionKind", target = "permissionKind")
    @Mapping(source = "account", target = "account", qualifiedByName = "fromEntityToAccountDtoForNotificationGroup")
    @Mapping(source = "task", target = "task", qualifiedByName = "fromEncryptEntityToEncryptTaskDto")
    @Mapping(source = "project", target = "project", qualifiedByName = "fromEncryptEntityToEncryptProjectDtoAutoComplete")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptTaskPermissionDto")
    TaskPermissionDto fromEncryptEntityToEncryptTaskPermissionDto(TaskPermission taskPermission, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = TaskPermissionDto.class, qualifiedByName = "fromEncryptEntityToEncryptTaskPermissionDto")
    List<TaskPermissionDto> fromEncryptEntityListToEncryptTaskPermissionDtoList(List<TaskPermission> taskPermissions, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "permissionKind", target = "permissionKind")
    @Mapping(source = "account", target = "account", qualifiedByName = "fromEntityToAccountDtoForNotificationGroup")
    @Mapping(source = "task", target = "task", qualifiedByName = "fromEncryptEntityToEncryptTaskDto")
    @Mapping(source = "project", target = "project", qualifiedByName = "fromEncryptEntityToEncryptProjectDtoAutoComplete")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptTaskPermissionAdminDto")
    TaskPermissionAdminDto fromEncryptEntityToEncryptTaskPermissionAdminDto(TaskPermission taskPermission, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = TaskPermissionAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptTaskPermissionAdminDto")
    List<TaskPermissionAdminDto> fromEncryptEntityListToEncryptTaskPermissionAdminDtoList(List<TaskPermission> taskPermissions, @Context KeyWrapperDto keyWrapper);
}
