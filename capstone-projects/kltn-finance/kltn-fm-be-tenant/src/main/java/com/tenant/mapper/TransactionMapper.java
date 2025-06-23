package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.transaction.TransactionAdminDto;
import com.tenant.dto.transaction.TransactionDto;
import com.tenant.form.transaction.CreateTransactionForm;
import com.tenant.form.transaction.UpdateTransactionForm;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {CategoryMapper.class, TransactionGroupMapper.class, PaymentPeriodMapper.class, AccountMapper.class, TagMapper.class})
public interface TransactionMapper extends EncryptDecryptMapper{
    @Mapping(source = "kind", target = "kind")
    @Mapping(target = "name", expression = "java(encrypt(secretKey, createTransactionForm.getName()))")
    @Mapping(target = "money", expression = "java(encrypt(secretKey, convertDoubleToString(createTransactionForm.getMoney())))")
    @Mapping(target = "note", expression = "java(encrypt(secretKey, createTransactionForm.getNote()))")
    @Mapping(target = "document", expression = "java(encrypt(secretKey, createTransactionForm.getDocument()))")
    @Mapping(source = "transactionDate", target = "transactionDate")
    @Mapping(source = "ignoreDebit", target = "ignoreDebit")
    @BeanMapping(ignoreByDefault = true)
    Transaction fromCreateTransactionFormToEncryptEntity(CreateTransactionForm createTransactionForm, @Context String secretKey);

    @Mapping(source = "kind", target = "kind")
    @Mapping(target = "name", expression = "java(encrypt(secretKey, updateTransactionForm.getName()))")
    @Mapping(target = "money", expression = "java(encrypt(secretKey, convertDoubleToString(updateTransactionForm.getMoney())))")
    @Mapping(target = "note", expression = "java(encrypt(secretKey, updateTransactionForm.getNote()))")
    @Mapping(target = "document", expression = "java(encrypt(secretKey, updateTransactionForm.getDocument()))")
    @Mapping(source = "transactionDate", target = "transactionDate")
    @Mapping(source = "ignoreDebit", target = "ignoreDebit")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateTransactionFormToEncryptEntity(UpdateTransactionForm updateTransactionForm, @MappingTarget Transaction transaction, @Context String secretKey);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "state", target = "state")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(source = "transactionGroup", target = "transactionGroup", qualifiedByName = "fromEncryptEntityToEncryptTransactionGroupDto")
    @Mapping(source = "category", target = "category", qualifiedByName = "fromEncryptEntityToEncryptCategoryDto")
    @Mapping(source = "paymentPeriod", target = "paymentPeriod", qualifiedByName = "fromEntityToPaymentPeriodDto")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, transaction.getName()))")
    @Mapping(target = "money", expression = "java(decryptAndEncrypt(keyWrapper, transaction.getMoney()))")
    @Mapping(target = "note", expression = "java(decryptAndEncrypt(keyWrapper, transaction.getNote()))")
    @Mapping(target = "document", expression = "java(decryptAndEncrypt(keyWrapper, transaction.getDocument()))")
    @Mapping(source = "transactionDate", target = "transactionDate")
    @Mapping(source = "addedBy", target = "addedBy", qualifiedByName = "fromEntityToAccountDtoAutoComplete")
    @Mapping(source = "approvedBy", target = "approvedBy", qualifiedByName = "fromEntityToAccountDtoAutoComplete")
    @Mapping(source = "approvedDate", target = "approvedDate")
    @Mapping(source = "ignoreDebit", target = "ignoreDebit")
    @Mapping(source = "tag", target = "tag", qualifiedByName = "fromEncryptEntityToEncryptTagDtoAutoComplete")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptTransactionAdminDto")
    TransactionAdminDto fromEncryptEntityToEncryptTransactionAdminDto(Transaction transaction, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = TransactionAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptTransactionAdminDto")
    List<TransactionAdminDto> fromEncryptEntityListToEncryptTransactionAdminDtoList(List<Transaction> transactions, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "state", target = "state")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "category", target = "category")
    @Mapping(source = "transactionGroup", target = "transactionGroup")
    @Mapping(source = "paymentPeriod", target = "paymentPeriod")
    @Mapping(target = "name", expression = "java(decrypt(secretKey, transaction.getName()))")
    @Mapping(target = "money", expression = "java(decrypt(secretKey, transaction.getMoney()))")
    @Mapping(target = "note", expression = "java(decrypt(secretKey, transaction.getNote()))")
    @Mapping(source = "transactionDate", target = "transactionDate")
    @Mapping(source = "addedBy", target = "addedBy")
    @Mapping(source = "approvedBy", target = "approvedBy")
    @Mapping(source = "approvedDate", target = "approvedDate")
    @Mapping(source = "ignoreDebit", target = "ignoreDebit")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToDecryptEntity")
    Transaction fromEncryptEntityToDecryptEntity(Transaction transaction, @Context String secretKey);

    @IterableMapping(elementTargetType = Transaction.class, qualifiedByName = "fromEncryptEntityToDecryptEntity")
    List<Transaction> fromEncryptEntityListToDecryptEntityList(List<Transaction> transactions, @Context String secretKey);

    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "state", target = "state")
    @Mapping(target = "name", expression = "java(encrypt(secretKey, transaction.getName()))")
    @Mapping(target = "money", expression = "java(encrypt(secretKey, transaction.getMoney()))")
    @Mapping(target = "note", expression = "java(encrypt(secretKey, transaction.getNote()))")
    @Mapping(source = "transactionDate", target = "transactionDate")
    @Mapping(source = "ignoreDebit", target = "ignoreDebit")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromDecryptEntityToEncryptEntity")
    Transaction fromDecryptEntityToEncryptEntity(Transaction transaction, @Context String secretKey);

    @IterableMapping(elementTargetType = Transaction.class, qualifiedByName = "fromDecryptEntityToEncryptEntity")
    List<Transaction> fromDecryptEntityListToEncryptEntityList(List<Transaction> transactions, @Context String secretKey);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "state", target = "state")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, transaction.getName()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptTransactionDtoAutoComplete")
    TransactionDto fromEncryptEntityToEncryptTransactionDtoAutoComplete(Transaction transaction, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = TransactionDto.class, qualifiedByName = "fromEncryptEntityToEncryptTransactionDtoAutoComplete")
    List<TransactionDto> fromEncryptEntityListToEncryptTransactionDtoAutoCompleteList(List<Transaction> transactions, @Context KeyWrapperDto keyWrapper);
}
