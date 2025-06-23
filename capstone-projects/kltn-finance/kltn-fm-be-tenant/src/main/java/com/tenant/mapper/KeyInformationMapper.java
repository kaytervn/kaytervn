package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.account.SubKeyWrapperDto;
import com.tenant.dto.keyInformation.KeyInformationAdminDto;
import com.tenant.dto.keyInformation.KeyInformationDto;
import com.tenant.form.keyInformation.CreateKeyInformationForm;
import com.tenant.form.keyInformation.UpdateKeyInformationForm;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {AccountMapper.class, KeyInformationGroupMapper.class, OrganizationMapper.class, TagMapper.class})
public interface KeyInformationMapper extends EncryptDecryptMapper {

    @Mapping(source = "kind", target = "kind")
    @Mapping(target = "name", expression = "java(encrypt(secretKey, createKeyInformationForm.getName()))")
    @Mapping(target = "description", expression = "java(encrypt(secretKey, createKeyInformationForm.getDescription()))")
    @Mapping(target = "additionalInformation", expression = "java(encrypt(secretKey, createKeyInformationForm.getAdditionalInformation()))")
    @Mapping(target = "document", expression = "java(encrypt(secretKey, createKeyInformationForm.getDocument()))")
    @BeanMapping(ignoreByDefault = true)
    KeyInformation fromCreateKeyInformationFormToEncryptEntity(CreateKeyInformationForm createKeyInformationForm, @Context String secretKey);

    @Mapping(source = "kind", target = "kind")
    @Mapping(target = "name", expression = "java(encrypt(secretKey, updateKeyInformationForm.getName()))")
    @Mapping(target = "description", expression = "java(encrypt(secretKey, updateKeyInformationForm.getDescription()))")
    @Mapping(target = "additionalInformation", expression = "java(encrypt(secretKey, updateKeyInformationForm.getAdditionalInformation()))")
    @Mapping(target = "document", expression = "java(encrypt(secretKey, updateKeyInformationForm.getDocument()))")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateKeyInformationFormToEncryptEntity(UpdateKeyInformationForm updateKeyInformationForm, @MappingTarget KeyInformation keyInformation, @Context String secretKey);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(source = "account", target = "account", qualifiedByName = "fromEntityToAccountDtoForNotificationGroup")
    @Mapping(source = "keyInformationGroup", target = "keyInformationGroup", qualifiedByName = "fromEncryptEntityToEncryptKeyInformationGroupDtoSubKeyWrapper")
    @Mapping(source = "organization", target = "organization", qualifiedByName = "fromEncryptEntityToEncryptOrganizationDtoSubKeyWrapper")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, keyInformation.getName()))")
    @Mapping(target = "description", expression = "java(decryptAndEncrypt(keyWrapper, keyInformation.getDescription()))")
    @Mapping(target = "additionalInformation", expression = "java(decryptAndEncrypt(keyWrapper, keyInformation.getAdditionalInformation()))")
    @Mapping(target = "document", expression = "java(decryptAndEncrypt(keyWrapper, keyInformation.getDocument()))")
    @Mapping(source = "tag", target = "tag", qualifiedByName = "fromEncryptEntityToEncryptTagDtoSubKeyWrapper")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptKeyInformationAdminDto")
    KeyInformationAdminDto fromEncryptEntityToEncryptKeyInformationAdminDto(KeyInformation keyInformation, @Context KeyWrapperDto keyWrapper, @Context SubKeyWrapperDto subKeyWrapper);

    @IterableMapping(elementTargetType = KeyInformationAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptKeyInformationAdminDto")
    List<KeyInformationAdminDto> fromEncryptEntityListToEncryptKeyInformationAdminDtoList(List<KeyInformation> keyInformations, @Context KeyWrapperDto keyWrapper, @Context SubKeyWrapperDto subKeyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, keyInformation.getName()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToKeyInformationDtoAutoComplete")
    KeyInformationDto fromEncryptEntityToKeyInformationDtoAutoComplete(KeyInformation keyInformation, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = KeyInformationDto.class, qualifiedByName = "fromEncryptEntityToKeyInformationDtoAutoComplete")
    List<KeyInformationDto> fromEncryptEntityListToKeyInformationDtoAutoCompleteList(List<KeyInformation> keyInformations, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(source = "account", target = "account")
    @Mapping(source = "keyInformationGroup", target = "keyInformationGroup")
    @Mapping(source = "organization", target = "organization")
    @Mapping(target = "name", expression = "java(decrypt(secretKey, keyInformation.getName()))")
    @Mapping(target = "description", expression = "java(decrypt(secretKey, keyInformation.getDescription()))")
    @Mapping(target = "additionalInformation", expression = "java(decrypt(secretKey, keyInformation.getAdditionalInformation()))")
    @Mapping(target = "document", expression = "java(decrypt(secretKey, keyInformation.getDocument()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToDecryptEntity")
    KeyInformation fromEncryptEntityToDecryptEntity(KeyInformation keyInformation, @Context String secretKey);

    @IterableMapping(elementTargetType = KeyInformation.class, qualifiedByName = "fromEncryptEntityToDecryptEntity")
    List<KeyInformation> fromEncryptEntityListToDecryptEntityList(List<KeyInformation> keyInformations, @Context String secretKey);

    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "account", target = "account")
    @Mapping(source = "keyInformationGroup", target = "keyInformationGroup")
    @Mapping(source = "organization", target = "organization")
    @Mapping(target = "name", expression = "java(encrypt(secretKey, keyInformation.getName()))")
    @Mapping(target = "description", expression = "java(encrypt(secretKey, keyInformation.getDescription()))")
    @Mapping(target = "additionalInformation", expression = "java(encrypt(secretKey, keyInformation.getAdditionalInformation()))")
    @Mapping(target = "document", expression = "java(encrypt(secretKey, keyInformation.getDocument()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromDecryptEntityToEncryptEntity")
    KeyInformation fromDecryptEntityToEncryptEntity(KeyInformation keyInformation, @Context String secretKey);

    @IterableMapping(elementTargetType = KeyInformation.class, qualifiedByName = "fromDecryptEntityToEncryptEntity")
    List<KeyInformation> fromDecryptEntityListToEncryptEntityList(List<KeyInformation> keyInformations, @Context String secretKey);
}
