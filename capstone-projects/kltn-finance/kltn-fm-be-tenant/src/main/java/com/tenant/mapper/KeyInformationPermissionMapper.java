package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.KeyInformationPermission.KeyInformationPermissionAdminDto;
import com.tenant.dto.KeyInformationPermission.KeyInformationPermissionDto;
import com.tenant.dto.account.SubKeyWrapperDto;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {AccountMapper.class, KeyInformationMapper.class, KeyInformationGroupMapper.class})
public interface KeyInformationPermissionMapper extends EncryptDecryptMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "permissionKind", target = "permissionKind")
    @Mapping(source = "account", target = "account", qualifiedByName = "fromEntityToAccountDtoForNotificationGroup")
    @Mapping(source = "keyInformation", target = "keyInformation", qualifiedByName = "fromEncryptEntityToKeyInformationDtoAutoComplete")
    @Mapping(source = "keyInformationGroup", target = "keyInformationGroup", qualifiedByName = "fromEncryptEntityToEncryptKeyInformationGroupDtoSubKeyWrapper")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptKeyInformationPermissionDto")
    KeyInformationPermissionDto fromEncryptEntityToEncryptKeyInformationPermissionDto(KeyInformationPermission keyInformationPermission, @Context KeyWrapperDto keyWrapper, @Context SubKeyWrapperDto subKeyWrapper);

    @IterableMapping(elementTargetType = KeyInformationPermissionDto.class, qualifiedByName = "fromEncryptEntityToEncryptKeyInformationPermissionDto")
    List<KeyInformationPermissionDto> fromEncryptEntityListToEncryptKeyInformationPermissionDtoList(List<KeyInformationPermission> keyInformationPermissions, @Context KeyWrapperDto keyWrapper, @Context SubKeyWrapperDto subKeyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "permissionKind", target = "permissionKind")
    @Mapping(source = "account", target = "account", qualifiedByName = "fromEntityToAccountDtoForNotificationGroup")
    @Mapping(source = "keyInformation", target = "keyInformation", qualifiedByName = "fromEncryptEntityToKeyInformationDtoAutoComplete")
    @Mapping(source = "keyInformationGroup", target = "keyInformationGroup", qualifiedByName = "fromEncryptEntityToEncryptKeyInformationGroupDtoSubKeyWrapper")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptKeyInformationPermissionAdminDto")
    KeyInformationPermissionAdminDto fromEncryptEntityToEncryptKeyInformationPermissionAdminDto(KeyInformationPermission keyInformationPermission, @Context KeyWrapperDto keyWrapper, @Context SubKeyWrapperDto subKeyWrapper);

    @IterableMapping(elementTargetType = KeyInformationPermissionAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptKeyInformationPermissionAdminDto")
    List<KeyInformationPermissionAdminDto> fromEncryptEntityListToEncryptKeyInformationPermissionAdminDtoList(List<KeyInformationPermission> keyInformationPermissions, @Context KeyWrapperDto keyWrapper, @Context SubKeyWrapperDto subKeyWrapper);
}
