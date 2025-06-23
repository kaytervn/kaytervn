package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.service.ServiceAdminDto;
import com.tenant.dto.service.ServiceDto;
import com.tenant.form.service.CreateServiceForm;
import com.tenant.form.service.UpdateServiceForm;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {CategoryMapper.class, ServiceGroupMapper.class, TagMapper.class})
public interface ServiceMapper extends EncryptDecryptMapper {

    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "startDate", target = "startDate")
    @Mapping(source = "periodKind", target = "periodKind")
    @Mapping(source = "expirationDate", target = "expirationDate")
    @Mapping(target = "name", expression = "java(encrypt(secretKey, createServiceForm.getName()))")
    @Mapping(target = "description", expression = "java(encrypt(secretKey, createServiceForm.getDescription()))")
    @Mapping(target = "money", expression = "java(encrypt(secretKey, convertDoubleToString(createServiceForm.getMoney())))")
    @BeanMapping(ignoreByDefault = true)
    Service fromCreateServiceFormToEncryptEntity(CreateServiceForm createServiceForm, @Context String secretKey);

    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "startDate", target = "startDate")
    @Mapping(source = "periodKind", target = "periodKind")
    @Mapping(source = "expirationDate", target = "expirationDate")
    @Mapping(target = "name", expression = "java(encrypt(secretKey, updateServiceForm.getName()))")
    @Mapping(target = "description", expression = "java(encrypt(secretKey, updateServiceForm.getDescription()))")
    @Mapping(target = "money", expression = "java(encrypt(secretKey, convertDoubleToString(updateServiceForm.getMoney())))")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateServiceFormToEncryptEntity(UpdateServiceForm updateServiceForm, @MappingTarget Service service, @Context String secretKey);

    @Mapping(source = "id", target = "id")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, service.getName()))")
    @Mapping(source = "kind", target = "kind")
    @Mapping(target = "description", expression = "java(decryptAndEncrypt(keyWrapper, service.getDescription()))")
    @Mapping(target = "money", expression = "java(decryptAndEncrypt(keyWrapper, service.getMoney()))")
    @Mapping(source = "startDate", target = "startDate")
    @Mapping(source = "periodKind", target = "periodKind")
    @Mapping(source = "expirationDate", target = "expirationDate")
    @Mapping(source = "serviceGroup", target = "serviceGroup", qualifiedByName = "fromEncryptEntityToEncryptServiceGroupDto")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(source = "isPaid", target = "isPaid")
    @Mapping(source = "tag", target = "tag", qualifiedByName = "fromEncryptEntityToEncryptTagDtoAutoComplete")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptServiceAdminDto")
    ServiceAdminDto fromEncryptEntityToEncryptServiceAdminDto(Service service, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = ServiceAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptServiceAdminDto")
    List<ServiceAdminDto> fromEncryptEntityListToEncryptServiceAdminDtoList(List<Service> services, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "periodKind", target = "periodKind")
    @Mapping(source = "status", target = "status")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, service.getName()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptServiceDtoAutoComplete")
    ServiceDto fromEncryptEntityToEncryptServiceDtoAutoComplete(Service service, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = ServiceDto.class, qualifiedByName = "fromEncryptEntityToEncryptServiceDtoAutoComplete")
    List<ServiceDto> fromEncryptEntityListToEncryptServiceDtoAutoCompleteList(List<Service> services, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "startDate", target = "startDate")
    @Mapping(source = "periodKind", target = "periodKind")
    @Mapping(source = "expirationDate", target = "expirationDate")
    @Mapping(source = "serviceGroup", target = "serviceGroup", qualifiedByName = "fromEncryptEntityToEncryptServiceGroupDto")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, service.getName()))")
    @Mapping(target = "description", expression = "java(decryptAndEncrypt(keyWrapper, service.getDescription()))")
    @Mapping(target = "money", expression = "java(decryptAndEncrypt(keyWrapper, service.getMoney()))")
    @Mapping(source = "isPaid", target = "isPaid")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptServiceDto")
    ServiceDto fromEncryptEntityToEncryptServiceDto(Service service, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "startDate", target = "startDate")
    @Mapping(source = "status", target = "status")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, service.getName()))")
    @Mapping(target = "money", expression = "java(decryptAndEncrypt(keyWrapper, service.getMoney()))")
    @Mapping(source = "isPaid", target = "isPaid")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptServiceDtoForNotificationGroup")
    ServiceDto fromEncryptEntityToEncryptServiceDtoForNotificationGroup(Service service, @Context KeyWrapperDto keyWrapper);
}
