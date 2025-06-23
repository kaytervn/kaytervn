package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.account.SubKeyWrapperDto;
import com.tenant.dto.tag.TagAdminDto;
import com.tenant.dto.tag.TagDto;
import com.tenant.form.tag.CreateTagForm;
import com.tenant.form.tag.UpdateTagForm;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TagMapper extends EncryptDecryptMapper {
    @Mapping(source = "kind", target = "kind")
    @Mapping(target = "name", expression = "java(encrypt(secretKey, createTagForm.getName()))")
    @Mapping(target = "colorCode", expression = "java(encrypt(secretKey, createTagForm.getColorCode()))")
    @BeanMapping(ignoreByDefault = true)
    Tag fromCreateTagFormToEntity(CreateTagForm createTagForm, @Context String secretKey);

    @Mapping(target = "name", expression = "java(encrypt(secretKey, updateTagForm.getName()))")
    @Mapping(target = "colorCode", expression = "java(encrypt(secretKey, updateTagForm.getColorCode()))")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateTagFormToEntity(UpdateTagForm updateTagForm, @MappingTarget Tag tag, @Context String secretKey);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, tag.getName()))")
    @Mapping(target = "colorCode", expression = "java(decryptAndEncrypt(keyWrapper, tag.getColorCode()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptTagAdminDto")
    TagAdminDto fromEncryptEntityToEncryptTagAdminDto(Tag tag, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = TagAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptTagAdminDto")
    List<TagAdminDto> fromEncryptEntityListToEncryptTagAdminDtoList(List<Tag> tags, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(target = "name", expression = "java(decryptAndEncryptSubKeyWrapper(subKeyWrapper, tag.getName()))")
    @Mapping(target = "colorCode", expression = "java(decryptAndEncryptSubKeyWrapper(subKeyWrapper, tag.getColorCode()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptTagDtoSubKeyWrapper")
    TagDto fromEncryptEntityToEncryptTagDtoSubKeyWrapper(Tag tag, @Context SubKeyWrapperDto subKeyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, tag.getName()))")
    @Mapping(target = "colorCode", expression = "java(decryptAndEncrypt(keyWrapper, tag.getColorCode()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptTagDtoAutoComplete")
    TagDto fromEncryptEntityToEncryptTagDtoAutoComplete(Tag tag, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = TagDto.class, qualifiedByName = "fromEncryptEntityToEncryptTagDtoAutoComplete")
    List<TagDto> fromEncryptEntityListToEncryptTagDtoAutoCompleteList(List<Tag> tags, @Context KeyWrapperDto keyWrapper);
}
