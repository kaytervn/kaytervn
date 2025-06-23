package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.notificationGroup.NotificationGroupAdminDto;
import com.tenant.dto.notificationGroup.NotificationGroupDto;
import com.tenant.form.notificationGroup.CreateNotificationGroupForm;
import com.tenant.form.notificationGroup.UpdateNotificationGroupForm;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {ServiceMapper.class, AccountMapper.class} )
public interface NotificationGroupMapper extends EncryptDecryptMapper {
    @Mapping(target = "name", expression = "java(encrypt(secretKey, createNotificationGroupForm.getName()))")
    @Mapping(target = "description", expression = "java(encrypt(secretKey, createNotificationGroupForm.getDescription()))")
    @BeanMapping(ignoreByDefault = true)
    NotificationGroup fromCreateNotificationGroupFormToEncryptEntity(CreateNotificationGroupForm createNotificationGroupForm, @Context String secretKey);

    @Mapping(target = "name", expression = "java(encrypt(secretKey, updateNotificationGroupForm.getName()))")
    @Mapping(target = "description", expression = "java(encrypt(secretKey, updateNotificationGroupForm.getDescription()))")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateGroupFormToEncryptEntity(UpdateNotificationGroupForm updateNotificationGroupForm, @MappingTarget NotificationGroup notificationGroup, @Context String secretKey);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, notificationGroup.getName()))")
    @Mapping(target = "description", expression = "java(decryptAndEncrypt(keyWrapper, notificationGroup.getDescription()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptNotificationGroupAdminDto")
    NotificationGroupAdminDto fromEncryptEntityToEncryptNotificationGroupAdminDto(NotificationGroup notificationGroup, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = NotificationGroupAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptNotificationGroupAdminDto")
    List<NotificationGroupAdminDto> fromEncryptEntityListToEncryptNotificationGroupAdminDtoList(List<NotificationGroup> notificationGroups, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, notificationGroup.getName()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptNotificationGroupDto")
    NotificationGroupDto fromEncryptEntityToEncryptNotificationGroupDto(NotificationGroup notificationGroup, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = NotificationGroupDto.class, qualifiedByName = "fromEncryptEntityToEncryptNotificationGroupDto")
    List<NotificationGroupDto> fromEncryptEntityListToEncryptNotificationGroupDtoList(List<NotificationGroup> notificationGroups, @Context KeyWrapperDto keyWrapper);
}
