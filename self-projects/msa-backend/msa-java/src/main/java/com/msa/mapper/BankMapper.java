package com.msa.mapper;

import com.msa.dto.auth.KeyWrapperDto;
import com.msa.dto.bank.BankDto;
import com.msa.form.bank.CreateBankForm;
import com.msa.form.bank.UpdateBankForm;
import com.msa.storage.tenant.model.Bank;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {TagMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BankMapper extends ABasicMapper {
    @Mapping(source = "username", target = "username")
    @Mapping(source = "numbers", target = "numbers")
    @BeanMapping(ignoreByDefault = true)
    Bank fromCreateBankFormToEntity(CreateBankForm createBankForm);

    @Mapping(source = "username", target = "username")
    @Mapping(source = "numbers", target = "numbers")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateBankFormToEntity(UpdateBankForm updateBankForm, @MappingTarget Bank bank);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "username", target = "username")
    @Mapping(target = "password", expression = "java(decryptAndEncrypt(keyWrapper, bank.getPassword()))")
    @Mapping(source = "numbers", target = "numbers")
    @Mapping(target = "pins", expression = "java(decryptAndEncrypt(keyWrapper, bank.getPins()))")
    @Mapping(source = "tag", target = "tag", qualifiedByName = "fromEntityToTagDtoAutoComplete")
    @Mapping(source = "createdDate", target = "createdDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToBankDto")
    BankDto fromEntityToBankDto(Bank bank, @Context KeyWrapperDto keyWrapper);

    @IterableMapping(elementTargetType = BankDto.class, qualifiedByName = "fromEntityToBankDto")
    List<BankDto> fromEntityListToBankDtoList(List<Bank> bankList, @Context KeyWrapperDto keyWrapper);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "tag", target = "tag", qualifiedByName = "fromEntityToTagDtoAutoComplete")
    @Mapping(source = "username", target = "username")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToBankDtoAutoComplete")
    BankDto fromEntityToBankDtoAutoComplete(Bank bank);

    @IterableMapping(elementTargetType = BankDto.class, qualifiedByName = "fromEntityToBankDtoAutoComplete")
    List<BankDto> fromEntityListToBankDtoListAutoComplete(List<Bank> bankList);
}
