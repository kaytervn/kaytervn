package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.transactionPermission.TransactionPermissionAdminDto;
import com.tenant.dto.transactionPermission.TransactionPermissionDto;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {AccountMapper.class, TransactionMapper.class, TransactionGroupMapper.class} )
public interface TransactionPermissionMapper extends EncryptDecryptMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "permissionKind", target = "permissionKind")
    @Mapping(source = "account", target = "account", qualifiedByName = "fromEntityToAccountDtoForNotificationGroup")
    @Mapping(source = "transaction", target = "transaction", qualifiedByName = "fromEncryptEntityToEncryptTransactionDtoAutoComplete")
    @Mapping(source = "transactionGroup", target = "transactionGroup", qualifiedByName = "fromEncryptEntityToEncryptTransactionGroupDto")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptTransactionPermissionDto")
    TransactionPermissionDto fromEncryptEntityToEncryptTransactionPermissionDto(TransactionPermission transactionPermission, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = TransactionPermissionDto.class, qualifiedByName = "fromEncryptEntityToEncryptTransactionPermissionDto")
    List<TransactionPermissionDto> fromEncryptEntityListToEncryptTransactionPermissionDtoList(List<TransactionPermission> transactionPermissions, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "permissionKind", target = "permissionKind")
    @Mapping(source = "account", target = "account", qualifiedByName = "fromEntityToAccountDtoForNotificationGroup")
    @Mapping(source = "transaction", target = "transaction", qualifiedByName = "fromEncryptEntityToEncryptTransactionDtoAutoComplete")
    @Mapping(source = "transactionGroup", target = "transactionGroup", qualifiedByName = "fromEncryptEntityToEncryptTransactionGroupDto")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptTransactionPermissionAdminDto")
    TransactionPermissionAdminDto fromEncryptEntityToEncryptTransactionPermissionAdminDto(TransactionPermission transactionPermission, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = TransactionPermissionAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptTransactionPermissionAdminDto")
    List<TransactionPermissionAdminDto> fromEncryptEntityListToEncryptTransactionPermissionAdminDtoList(List<TransactionPermission> transactionPermissions, @Context KeyWrapperDto keyWrapper);
}