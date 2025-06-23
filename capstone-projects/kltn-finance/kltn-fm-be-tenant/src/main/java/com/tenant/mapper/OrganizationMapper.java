package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.account.SubKeyWrapperDto;
import com.tenant.dto.organization.OrganizationAdminDto;
import com.tenant.dto.organization.OrganizationDto;
import com.tenant.form.organization.CreateOrganizationForm;
import com.tenant.form.organization.UpdateOrganizationForm;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OrganizationMapper extends EncryptDecryptMapper {

    @Mapping(target = "name", expression = "java(encrypt(secretKey, createOrganizationForm.getName()))")
    @Mapping(target = "logo", expression = "java(encrypt(secretKey, createOrganizationForm.getLogo()))")
    @BeanMapping(ignoreByDefault = true)
    Organization fromCreateOrganizationFormToEntity(CreateOrganizationForm createOrganizationForm, @Context String secretKey);

    @Mapping(target = "name", expression = "java(encrypt(secretKey, updateOrganizationForm.getName()))")
    @Mapping(target = "logo", expression = "java(encrypt(secretKey, updateOrganizationForm.getLogo()))")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateOrganizationFormToEntity(UpdateOrganizationForm updateOrganizationForm, @MappingTarget Organization organization, @Context String secretKey);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, organization.getName()))")
    @Mapping(target = "logo", expression = "java(decryptAndEncrypt(keyWrapper, organization.getLogo()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptOrganizationAdminDto")
    OrganizationAdminDto fromEncryptEntityToEncryptOrganizationAdminDto(Organization organization, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = OrganizationAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptOrganizationAdminDto")
    List<OrganizationAdminDto> fromEncryptEntityListToEncryptOrganizationAdminDtoList(List<Organization> organizations, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(target = "name", expression = "java(decryptAndEncryptSubKeyWrapper(subKeyWrapper, organization.getName()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptOrganizationDtoSubKeyWrapper")
    OrganizationDto fromEncryptEntityToEncryptOrganizationDtoSubKeyWrapper(Organization organization, @Context SubKeyWrapperDto subKeyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(KeyWrapper, organization.getName()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptOrganizationDtoAutoComplete")
    OrganizationDto fromEncryptEntityToEncryptOrganizationDtoAutoComplete(Organization organization, @Context KeyWrapperDto KeyWrapper);

    @IterableMapping(elementTargetType = OrganizationDto.class, qualifiedByName = "fromEncryptEntityToEncryptOrganizationDtoAutoComplete")
    List<OrganizationDto> fromEncryptEntityListToEncryptOrganizationDtoAutoCompleteList(List<Organization> organizations, @Context KeyWrapperDto KeyWrapper);

}
