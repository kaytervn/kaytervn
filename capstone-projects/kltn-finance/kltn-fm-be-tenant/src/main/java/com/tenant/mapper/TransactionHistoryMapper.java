package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.transactionHistory.TransactionHistoryAdminDto;
import com.tenant.dto.transactionHistory.TransactionHistoryDto;
import com.tenant.form.transactionHistory.UpdateTransactionHistoryForm;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {AccountMapper.class, TransactionMapper.class})
public interface TransactionHistoryMapper extends EncryptDecryptMapper {
    @Mapping(source = "note", target = "note")
    @Mapping(source = "state", target = "state")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateTransactionHistoryFormToEntity(UpdateTransactionHistoryForm updateTransactionHistoryForm, @MappingTarget TransactionHistory transactionHistory);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "note", target = "note")
    @Mapping(source = "state", target = "state")
    @Mapping(source = "status", target = "status")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToTransactionHistoryDto")
    TransactionHistoryDto fromEncryptEntityToTransactionHistoryDto(TransactionHistory transactionHistory);

    @IterableMapping(elementTargetType = TransactionHistoryDto.class, qualifiedByName = "fromEntityToTransactionHistoryDto")
    List<TransactionHistoryDto> fromEntityListToTransactionHistoryDtoList(List<TransactionHistory> transactionHistories);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "state", target = "state")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "account", target = "account", qualifiedByName = "fromEntityToAccountDtoForNotificationGroup")
    @Mapping(source = "transaction", target = "transaction", qualifiedByName = "fromEncryptEntityToEncryptTransactionDto")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(target = "note", expression = "java(decryptAndEncrypt(keyWrapper, transactionHistory.getNote()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptTransactionHistoryAdminDto")
    TransactionHistoryAdminDto fromEncryptEntityToEncryptTransactionHistoryAdminDto(TransactionHistory transactionHistory, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = TransactionHistoryAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptTransactionHistoryAdminDto")
    List<TransactionHistoryAdminDto> fromEncryptEntityListToEncryptTransactionHistoryAdminDtoList(List<TransactionHistory> transactionHistories, @Context KeyWrapperDto keyWrapper);
}
