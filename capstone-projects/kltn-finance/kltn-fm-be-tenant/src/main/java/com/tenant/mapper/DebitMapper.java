package com.tenant.mapper;

import com.tenant.dto.account.KeyWrapperDto;
import com.tenant.dto.debit.DebitAdminDto;
import com.tenant.dto.debit.DebitDto;
import com.tenant.form.debit.UpdateDebitForm;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {CategoryMapper.class, TransactionGroupMapper.class, TransactionMapper.class, AccountMapper.class, TagMapper.class})
public interface DebitMapper extends EncryptDecryptMapper{

    @Mapping(source = "kind", target = "kind")
    @Mapping(target = "name", expression = "java(encrypt(secretKey, updateDebitForm.getName()))")
    @Mapping(target = "money", expression = "java(encrypt(secretKey, convertDoubleToString(updateDebitForm.getMoney())))")
    @Mapping(target = "note", expression = "java(encrypt(secretKey, updateDebitForm.getNote()))")
    @Mapping(target = "document", expression = "java(encrypt(secretKey, updateDebitForm.getDocument()))")
    @Mapping(source = "transactionDate", target = "transactionDate")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateDebitFormToEncryptEntity(UpdateDebitForm updateDebitForm, @MappingTarget Debit debit, @Context String secretKey);

    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "state", target = "state")
    @Mapping(source = "transactionGroup", target = "transactionGroup")
    @Mapping(source = "category", target = "category")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "money", target = "money")
    @Mapping(source = "note", target = "note")
    @Mapping(source = "document", target = "document")
    @Mapping(source = "transactionDate", target = "transactionDate")
    @Mapping(source = "addedBy", target = "addedBy")
    @Mapping(source = "tag", target = "tag")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToDebit")
    Debit fromEncryptTransactionToEntity(Transaction transaction);

    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "state", target = "state")
    @Mapping(source = "transactionGroup", target = "transactionGroup")
    @Mapping(source = "category", target = "category")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "money", target = "money")
    @Mapping(source = "note", target = "note")
    @Mapping(source = "document", target = "document")
    @Mapping(source = "transactionDate", target = "transactionDate")
    @Mapping(source = "addedBy", target = "addedBy")
    @Mapping(source = "tag", target = "tag")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptTransactionToEntity")
    void fromEncryptTransactionToEntity(Transaction transaction, @MappingTarget Debit debit);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "state", target = "state")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(source = "transactionGroup", target = "transactionGroup", qualifiedByName = "fromEncryptEntityToEncryptTransactionGroupDto")
    @Mapping(source = "category", target = "category", qualifiedByName = "fromEncryptEntityToEncryptCategoryDto")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, debit.getName()))")
    @Mapping(target = "money", expression = "java(decryptAndEncrypt(keyWrapper, debit.getMoney()))")
    @Mapping(target = "note", expression = "java(decryptAndEncrypt(keyWrapper, debit.getNote()))")
    @Mapping(target = "document", expression = "java(decryptAndEncrypt(keyWrapper, debit.getDocument()))")
    @Mapping(source = "transactionDate", target = "transactionDate")
    @Mapping(source = "addedBy", target = "addedBy", qualifiedByName = "fromEntityToAccountDtoAutoComplete")
    @Mapping(source = "transaction", target = "transaction", qualifiedByName = "fromEncryptEntityToEncryptTransactionDtoAutoComplete")
    @Mapping(source = "tag", target = "tag", qualifiedByName = "fromEncryptEntityToEncryptTagDtoAutoComplete")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptDebitAdminDto")
    DebitAdminDto fromEncryptEntityToEncryptDebitAdminDto(Debit debit, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = DebitAdminDto.class, qualifiedByName = "fromEncryptEntityToEncryptDebitAdminDto")
    List<DebitAdminDto> fromEncryptEntityListToEncryptDebitAdminDtoList(List<Debit> debits, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "state", target = "state")
    @Mapping(target = "name", expression = "java(decryptAndEncrypt(keyWrapper, debit.getName()))")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToEncryptDebitDtoAutoComplete")
    DebitDto fromEncryptEntityToEncryptDebitDtoAutoComplete(Debit debit, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = DebitDto.class, qualifiedByName = "fromEncryptEntityToEncryptDebitDtoAutoComplete")
    List<DebitDto> fromEncryptEntityListToEncryptDebitDtoAutoCompleteList(List<Debit> debits, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "state", target = "state")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "category", target = "category")
    @Mapping(source = "transactionGroup", target = "transactionGroup")
    @Mapping(source = "transaction", target = "transaction")
    @Mapping(target = "name", expression = "java(decrypt(secretKey, debit.getName()))")
    @Mapping(target = "money", expression = "java(decrypt(secretKey, debit.getMoney()))")
    @Mapping(target = "note", expression = "java(decrypt(secretKey, debit.getNote()))")
    @Mapping(source = "transactionDate", target = "transactionDate")
    @Mapping(source = "addedBy", target = "addedBy")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEncryptEntityToDecryptEntity")
    Debit fromEncryptEntityToDecryptEntity(Debit debit, @Context String secretKey);

    @IterableMapping(elementTargetType = Debit.class, qualifiedByName = "fromEncryptEntityToDecryptEntity")
    List<Debit> fromEncryptEntityListToDecryptEntityList(List<Debit> debits, @Context String secretKey);
}
