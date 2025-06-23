package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.serviceNotificationGroup.ServiceNotificationGroupAdminDto;
import com.tenant.dto.serviceNotificationGroup.ServiceNotificationGroupDto;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {ServiceMapper.class, NotificationGroupMapper.class} )
public interface ServiceNotificationGroupMapper extends EncryptDecryptMapper {

    @Mapping(source = "id", target = "id")
    @Mapping(source = "service", target = "service", qualifiedByName = "fromEncryptEntityToEncryptServiceDtoForNotificationGroup")
    @Mapping(source = "notificationGroup", target = "notificationGroup", qualifiedByName = "fromEncryptEntityToEncryptNotificationGroupDto")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptServiceNotificationGroupDto")
    ServiceNotificationGroupDto fromEncryptEntityToEncryptServiceNotificationGroupDto(ServiceNotificationGroup serviceNotificationGroup, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = ServiceNotificationGroupDto.class, qualifiedByName = "fromEncryptEntityToEncryptServiceNotificationGroupDto")
    List<ServiceNotificationGroupDto> fromEncryptEntityListToEncryptServiceNotificationGroupDtoList(List<ServiceNotificationGroup> userGroupNotifications, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "service", target = "service", qualifiedByName = "fromEncryptEntityToEncryptServiceDtoForNotificationGroup")
    @Mapping(source = "notificationGroup", target = "notificationGroup", qualifiedByName = "fromEncryptEntityToEncryptNotificationGroupDto")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptServiceNotificationGroupAdminDto")
    ServiceNotificationGroupAdminDto fromEncryptEntityToEncryptServiceNotificationGroupAdminDto(ServiceNotificationGroup serviceNotificationGroup, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = ServiceNotificationGroupAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptServiceNotificationGroupAdminDto")
    List<ServiceNotificationGroupAdminDto> fromEncryptEntityListToEncryptServiceNotificationGroupAdminDtoList(List<ServiceNotificationGroup> serviceNotificationGroups, @Context KeyWrapperDto keyWrapper);
}
