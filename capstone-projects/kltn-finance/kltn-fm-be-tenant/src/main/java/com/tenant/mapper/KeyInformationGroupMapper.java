package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.account.SubKeyWrapperDto;
import com.tenant.dto.keyInformationGroup.KeyInformationGroupAdminDto;
import com.tenant.dto.keyInformationGroup.KeyInformationGroupDto;
import com.tenant.form.keyInformationGroup.CreateKeyInformationGroupForm;
import com.tenant.form.keyInformationGroup.UpdateKeyInformationGroupForm;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface KeyInformationGroupMapper extends EncryptDecryptMapper {

    @Mapping(target = "name", expression = "java(encrypt(secretKey, createKeyInformationGroupForm.getName()))")
    @Mapping(target = "description", expression = "java(encrypt(secretKey, createKeyInformationGroupForm.getDescription()))")
    @BeanMapping(ignoreByDefault = true)
    KeyInformationGroup fromCreateKeyInformationGroupFormToEntity(CreateKeyInformationGroupForm createKeyInformationGroupForm, @Context String secretKey);

    @Mapping(target = "name", expression = "java(encrypt(secretKey, updateKeyInformationGroupForm.getName()))")
    @Mapping(target = "description", expression = "java(encrypt(secretKey, updateKeyInformationGroupForm.getDescription()))")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateKeyInformationGroupFormToEntity(UpdateKeyInformationGroupForm updateKeyInformationGroupForm, @MappingTarget KeyInformationGroup keyInformationGroup, @Context String secretKey);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, keyInformationGroup.getName()))")
    @Mapping(target = "description", expression = "java(decryptAndEncrypt(keyWrapper, keyInformationGroup.getDescription()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptKeyInformationGroupAdminDto")
    KeyInformationGroupAdminDto fromEncryptEntityToEncryptKeyInformationGroupAdminDto(KeyInformationGroup keyInformationGroup, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = KeyInformationGroupAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptKeyInformationGroupAdminDto")
    List<KeyInformationGroupAdminDto> fromEncryptEntityListToEncryptKeyInformationGroupAdminDtoList(List<KeyInformationGroup> keyInformationGroups, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(target = "name", expression = "java(decryptAndEncryptSubKeyWrapper(subKeyWrapper, keyInformationGroup.getName()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptKeyInformationGroupDtoSubKeyWrapper")
    KeyInformationGroupDto fromEncryptEntityToEncryptKeyInformationGroupDtoSubKeyWrapper(KeyInformationGroup keyInformationGroup, @Context SubKeyWrapperDto subKeyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, keyInformationGroup.getName()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptKeyInformationGroupDtoAutoComplete")
    KeyInformationGroupDto fromEncryptEntityToEncryptKeyInformationGroupDtoAutoComplete(KeyInformationGroup keyInformationGroup, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = KeyInformationGroupDto.class, qualifiedByName = "fromEncryptEntityToEncryptKeyInformationGroupDtoAutoComplete")
    List<KeyInformationGroupDto> fromEncryptEntityListToEncryptKeyInformationGroupDtoAutoCompleteList(List<KeyInformationGroup> keyInformationGroups, @Context KeyWrapperDto keyWrapper);
}