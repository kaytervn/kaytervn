package com.master.mapper;

import com.master.dto.accountBranch.AccountBranchDto;
import com.master.model.AccountBranch;
import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring", uses = {BranchMapper.class, AccountMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AccountBranchMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "branch", target = "branch", qualifiedByName = "fromEntityToBranchDtoAutoComplete")
    @Mapping(source = "account", target = "account", qualifiedByName = "fromEntityToAccountDto")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToAccountBranchDto")
    AccountBranchDto fromEntityToAccountBranchDto(AccountBranch accountbranch);

    @IterableMapping(elementTargetType = AccountBranchDto.class, qualifiedByName = "fromEntityToAccountBranchDto")
    List<AccountBranchDto> fromEntityListToAccountBranchDtoList(List<AccountBranch> accountbranchList);
}