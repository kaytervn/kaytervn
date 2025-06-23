package com.master.mapper;

import com.master.form.customer.CreateCustomerForm;
import com.master.form.customer.UpdateCustomerForm;
import com.master.form.customer.UpdateCustomerProfileForm;
import com.master.model.Account;
import com.master.model.Customer;
import com.master.dto.customer.CustomerAdminDto;
import com.master.dto.customer.CustomerDto;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {AccountMapper.class, BranchMapper.class})
public interface CustomerMapper {
    @Mapping(source = "status", target = "status")
    @BeanMapping(ignoreByDefault = true)
    Customer fromCreateCustomerFormToEntity(CreateCustomerForm createCustomerForm);

    @Mapping(target = "status", source = "status")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateCustomerFormToEntity(UpdateCustomerForm updateCustomerForm, @MappingTarget Customer customer);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "account", source = "account", qualifiedByName = "fromEntityToAccountDto")
    @Mapping(target = "branch", source = "branch", qualifiedByName = "fromEntityToBranchDtoAutoComplete")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "createdDate", source = "createdDate")
    @Mapping(target = "modifiedDate", source = "modifiedDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToCustomerAdminDto")
    CustomerAdminDto fromEntityToCustomerAdminDto(Customer customer);

    @IterableMapping(elementTargetType = CustomerAdminDto.class, qualifiedByName = "fromEntityToCustomerAdminDto")
    List<CustomerAdminDto> fromEntityListToCustomerAdminDtoList(List<Customer> customers);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "account", source = "account", qualifiedByName = "fromEntityToAccountDtoAutoComplete")
    @Mapping(target = "status", source = "status")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToCustomerDto")
    CustomerDto fromEntityToCustomerDto(Customer customer);

    @IterableMapping(elementTargetType = CustomerDto.class, qualifiedByName = "fromEntityToCustomerDto")
    List<CustomerDto> fromEntityListToCustomerDtoList(List<Customer> customers);

    @Mapping(source = "username", target = "username")
    @Mapping(source = "fullName", target = "fullName")
    @Mapping(source = "avatarPath", target = "avatarPath")
    @Mapping(source = "email", target = "email")
    @Mapping(source = "phone", target = "phone")
    @Mapping(source = "status", target = "status")
    @BeanMapping(ignoreByDefault = true)
    Account fromCreateCustomerFormToAccountEntity(CreateCustomerForm createAccountAdminForm);

    @Mapping(source = "fullName", target = "fullName")
    @Mapping(source = "avatarPath", target = "avatarPath")
    @Mapping(source = "email", target = "email")
    @Mapping(source = "phone", target = "phone")
    @Mapping(source = "status", target = "status")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateCustomerFormToAccountEntity(UpdateCustomerForm updateAccountAdminForm, @MappingTarget Account account);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "account", target = "account", qualifiedByName = "fromEntityToAccountDtoProfile")
    @Mapping(source = "status", target = "status")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToCustomerDtoProfile")
    CustomerDto fromEntityToCustomerDtoProfile(Customer customer);

    @Mapping(source = "fullName", target = "fullName")
    @Mapping(source = "avatarPath", target = "avatarPath", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    @BeanMapping(ignoreByDefault = true)
    void mappingUpdateCustomerProfileFormToEntity(UpdateCustomerProfileForm updateCustomerProfileForm, @MappingTarget Account account);
}
