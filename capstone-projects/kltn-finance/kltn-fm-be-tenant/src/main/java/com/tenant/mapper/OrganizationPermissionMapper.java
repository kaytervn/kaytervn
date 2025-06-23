package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.organizationPermission.OrganizationPermissionAdminDto;
import com.tenant.dto.organizationPermission.OrganizationPermissionDto;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {AccountMapper.class, OrganizationMapper.class})
public interface OrganizationPermissionMapper extends EncryptDecryptMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "account", target = "account", qualifiedByName = "fromEntityToAccountDtoForNotificationGroup")
    @Mapping(source = "organization", target = "organization", qualifiedByName = "fromEncryptEntityToEncryptOrganizationDtoAutoComplete")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptOrganizationPermissionDto")
    OrganizationPermissionDto fromEncryptEntityToEncryptOrganizationPermissionDto(OrganizationPermission organizationPermission, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = OrganizationPermissionDto.class, qualifiedByName = "fromEncryptEntityToEncryptOrganizationPermissionDto")
    List<OrganizationPermissionDto> fromEncryptEntityListToEncryptOrganizationPermissionDtoList(List<OrganizationPermission> organizationPermissions, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "account", target = "account", qualifiedByName = "fromEntityToAccountDtoForNotificationGroup")
    @Mapping(source = "organization", target = "organization", qualifiedByName = "fromEncryptEntityToEncryptOrganizationDtoAutoComplete")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptOrganizationPermissionAdminDto")
    OrganizationPermissionAdminDto fromEncryptEntityToEncryptOrganizationPermissionAdminDto(OrganizationPermission organizationPermission, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = OrganizationPermissionAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptOrganizationPermissionAdminDto")
    List<OrganizationPermissionAdminDto> fromEncryptEntityListToEncryptOrganizationPermissionAdminDtoList(List<OrganizationPermission> organizationPermissions, @Context KeyWrapperDto keyWrapper);
}
