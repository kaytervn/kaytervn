package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.transactionGroup.TransactionGroupAdminDto;
import com.tenant.dto.transactionGroup.TransactionGroupDto;
import com.tenant.form.transactionGroup.CreateTransactionGroupForm;
import com.tenant.form.transactionGroup.UpdateTransactionGroupForm;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TransactionGroupMapper extends EncryptDecryptMapper{

    @Mapping(target = "name", expression = "java(encrypt(secretKey, createTransactionGroupForm.getName()))")
    @Mapping(target = "description", expression = "java(encrypt(secretKey, createTransactionGroupForm.getDescription()))")
    @BeanMapping(ignoreByDefault = true)
    TransactionGroup fromCreateTransactionGroupFormToEncryptEntity(CreateTransactionGroupForm createTransactionGroupForm, @Context String secretKey);

    @Mapping(target = "name", expression = "java(encrypt(secretKey, updateTransactionGroupForm.getName()))")
    @Mapping(target = "description", expression = "java(encrypt(secretKey, updateTransactionGroupForm.getDescription()))")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateTransactionGroupFormToEncryptEntity(UpdateTransactionGroupForm updateTransactionGroupForm, @MappingTarget TransactionGroup transactionGroup, @Context String secretKey);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, transactionGroup.getName()))")
    @Mapping(target = "description", expression = "java(decryptAndEncrypt(keyWrapper, transactionGroup.getDescription()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptTransactionGroupAdminDto")
    TransactionGroupAdminDto fromEncryptEntityToEncryptTransactionGroupAdminDto(TransactionGroup transactionGroup, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = TransactionGroupAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptTransactionGroupAdminDto")
    List<TransactionGroupAdminDto> fromEncryptEntityListToEncryptTransactionGroupAdminDtoList(List<TransactionGroup> transactionGroups, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, transactionGroup.getName()))")
    @Mapping(source = "status", target = "status")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptTransactionGroupDto")
    TransactionGroupDto fromEncryptEntityToEncryptTransactionGroupDto(TransactionGroup transactionGroup, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = TransactionGroupDto.class, qualifiedByName = "fromEncryptEntityToEncryptTransactionGroupDto")
    List<TransactionGroupDto> fromEncryptEntityListToEncryptTransactionGroupDtoList(List<TransactionGroup> transactionGroups, @Context KeyWrapperDto keyWrapper);
}
