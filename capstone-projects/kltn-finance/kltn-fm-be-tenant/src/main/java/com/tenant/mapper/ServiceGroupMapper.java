package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.serviceGroup.ServiceGroupAdminDto;
import com.tenant.dto.serviceGroup.ServiceGroupDto;
import com.tenant.form.serviceGroup.CreateServiceGroupForm;
import com.tenant.form.serviceGroup.UpdateServiceGroupForm;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ServiceGroupMapper extends EncryptDecryptMapper {
    @Mapping(target = "name", expression = "java(encrypt(secretKey, createServiceGroupForm.getName()))")
    @Mapping(target = "description", expression = "java(encrypt(secretKey, createServiceGroupForm.getDescription()))")
    @BeanMapping(ignoreByDefault = true)
    ServiceGroup fromCreateServiceGroupFormToEncryptEntity(CreateServiceGroupForm createServiceGroupForm, @Context String secretKey);

    @Mapping(target = "name", expression = "java(encrypt(secretKey, updateServiceGroupForm.getName()))")
    @Mapping(target = "description", expression = "java(encrypt(secretKey, updateServiceGroupForm.getDescription()))")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateServiceGroupFormToEncryptEntity(UpdateServiceGroupForm updateServiceGroupForm, @MappingTarget ServiceGroup serviceGroup, @Context String secretKey);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, serviceGroup.getName()))")
    @Mapping(target = "description", expression = "java(decryptAndEncrypt(keyWrapper, serviceGroup.getDescription()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptServiceGroupAdminDto")
    ServiceGroupAdminDto fromEncryptEntityToEncryptServiceGroupAdminDto(ServiceGroup serviceGroup, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = ServiceGroupAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptServiceGroupAdminDto")
    List<ServiceGroupAdminDto> fromEncryptEntityListToEncryptServiceGroupAdminDtoList(List<ServiceGroup> serviceGroups, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "status", target = "status")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, serviceGroup.getName()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptServiceGroupDto")
    ServiceGroupDto fromEncryptEntityToEncryptServiceGroupDto(ServiceGroup serviceGroup, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = ServiceGroupDto.class, qualifiedByName = "fromEncryptEntityToEncryptServiceGroupDto")
    List<ServiceGroupDto> fromEncryptEntityListToEncryptServiceGroupDtoList(List<ServiceGroup> serviceGroups, @Context KeyWrapperDto keyWrapper);
}