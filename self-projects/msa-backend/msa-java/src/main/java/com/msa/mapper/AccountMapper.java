package com.msa.mapper;

import com.msa.dto.account.AccountDto;
import com.msa.dto.auth.KeyWrapperDto;
import com.msa.form.account.CreateAccountForm;
import com.msa.form.account.UpdateAccountForm;
import com.msa.storage.tenant.model.Account;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {PlatformMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AccountMapper extends ABasicMapper {
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "note", target = "note")
    @BeanMapping(ignoreByDefault = true)
    Account fromCreateAccountFormToEntity(CreateAccountForm createAccountForm);

    @Mapping(source = "note", target = "note")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateAccountFormToEntity(UpdateAccountForm updateAccountForm, @MappingTarget Account account);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "username", target = "username")
    @Mapping(target = "password", expression = "java(decryptAndEncrypt(keyWrapper, account.getPassword()))")
    @Mapping(source = "note", target = "note")
    @Mapping(source = "platform", target = "platform", qualifiedByName = "fromEntityToPlatformDto")
    @Mapping(source = "parent", target = "parent", qualifiedByName = "fromEntityToAccountDtoAutoComplete")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "totalBackupCodes", target = "totalBackupCodes")
    @Mapping(source = "totalChildren", target = "totalChildren")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToAccountDto")
    AccountDto fromEntityToAccountDto(Account account, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = AccountDto.class, qualifiedByName = "fromEntityToAccountDto")
    List<AccountDto> fromEntityListToAccountDtoList(List<Account> accountList, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "username", target = "username")
    @Mapping(source = "platform", target = "platform", qualifiedByName = "fromEntityToPlatformDto")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToAccountDtoAutoComplete")
    AccountDto fromEntityToAccountDtoAutoComplete(Account account);

    @IterableMapping(elementTargetType = AccountDto.class, qualifiedByName = "fromEntityToAccountDtoAutoComplete")
    List<AccountDto> fromEntityListToAccountDtoListAutoComplete(List<Account> accountList);
}
