package com.tenant.mapper;

import com.tenant.dto.notification.NotificationAdminDto;
import com.tenant.dto.notification.NotificationDto;
import com.tenant.form.notification.CreateNotificationForm;
import com.tenant.form.notification.UpdateNotificationForm;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface NotificationMapper {

    @Mapping(source = "message", target = "message")
    @Mapping(source = "state", target = "state")
    @Mapping(source = "serviceId", target = "serviceId")
    @Mapping(source = "accountId", target = "accountId")
    @BeanMapping(ignoreByDefault = true)
    Notification fromCreateNotificationFormToEntity(CreateNotificationForm createNotificationForm);

    @Mapping(source = "message", target = "message")
    @Mapping(source = "state", target = "state")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateNotificationFormToEntity(UpdateNotificationForm updateNotificationForm, @MappingTarget Notification Notification);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "message", target = "message")
    @Mapping(source = "state", target = "state")
    @Mapping(source = "serviceId", target = "serviceId")
    @Mapping(source = "accountId", target = "accountId")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToNotificationAdminDto")
    NotificationAdminDto fromEntityToNotificationAdminDto(Notification Notification);

    @IterableMapping(elementTargetType = NotificationAdminDto.class, qualifiedByName = "fromEntityToNotificationAdminDto")
    List<NotificationAdminDto> fromEntityListToNotificationAdminDtoList(List<Notification> Notifications);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "message", target = "message")
    @Mapping(source = "state", target = "state")
    @Mapping(source = "serviceId", target = "serviceId")
    @Mapping(source = "accountId", target = "accountId")
    @Mapping(source = "createdDate", target = "createdDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToNotificationDto")
    NotificationDto fromEntityToNotificationDto(Notification Notification);

    @IterableMapping(elementTargetType = NotificationDto.class, qualifiedByName = "fromEntityToNotificationDto")
    List<NotificationDto> fromEntityListToNotificationDtoList(List<Notification> Notifications);

}
