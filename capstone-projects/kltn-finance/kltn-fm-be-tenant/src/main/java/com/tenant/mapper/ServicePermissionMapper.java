package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.servicePermission.ServicePermissionAdminDto;
import com.tenant.dto.servicePermission.ServicePermissionDto;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {AccountMapper.class, ServiceMapper.class, ServiceGroupMapper.class} )
public interface ServicePermissionMapper extends EncryptDecryptMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "permissionKind", target = "permissionKind")
    @Mapping(source = "account", target = "account", qualifiedByName = "fromEntityToAccountDtoForNotificationGroup")
    @Mapping(source = "service", target = "service", qualifiedByName = "fromEncryptEntityToEncryptServiceDtoAutoComplete")
    @Mapping(source = "serviceGroup", target = "serviceGroup", qualifiedByName = "fromEncryptEntityToEncryptServiceGroupDto")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptServicePermissionDto")
    ServicePermissionDto fromEncryptEntityToEncryptServicePermissionDto(ServicePermission servicePermission, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = ServicePermissionDto.class, qualifiedByName = "fromEncryptEntityToEncryptServicePermissionDto")
    List<ServicePermissionDto> fromEncryptEntityListToEncryptServicePermissionDtoList(List<ServicePermission> servicePermissions, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "permissionKind", target = "permissionKind")
    @Mapping(source = "account", target = "account", qualifiedByName = "fromEntityToAccountDtoForNotificationGroup")
    @Mapping(source = "service", target = "service", qualifiedByName = "fromEncryptEntityToEncryptServiceDtoAutoComplete")
    @Mapping(source = "serviceGroup", target = "serviceGroup", qualifiedByName = "fromEncryptEntityToEncryptServiceGroupDto")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptServicePermissionAdminDto")
    ServicePermissionAdminDto fromEncryptEntityToEncryptServicePermissionAdminDto(ServicePermission servicePermission, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = ServicePermissionAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptServicePermissionAdminDto")
    List<ServicePermissionAdminDto> fromEncryptEntityListToEncryptServicePermissionAdminDtoList(List<ServicePermission> servicePermissions, @Context KeyWrapperDto keyWrapper);
}
