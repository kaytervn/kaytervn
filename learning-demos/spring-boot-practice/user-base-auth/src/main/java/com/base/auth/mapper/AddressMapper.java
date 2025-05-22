package com.base.auth.mapper;

import com.base.auth.dto.address.AddressAdminDto;
import com.base.auth.dto.address.AddressDto;
import com.base.auth.form.address.CreateAddressForm;
import com.base.auth.form.address.UpdateAddressForm;
import com.base.auth.model.Address;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {NationMapper.class, UserMapper.class})
public interface AddressMapper {
    @BeanMapping(ignoreByDefault = true)
    @Mapping(source = "address", target = "address")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "phone", target = "phone")
    @Mapping(source = "status", target = "status")
    Address fromCreateAddressFormToEntity(CreateAddressForm createAddressForm);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(source = "address", target = "address")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "phone", target = "phone")
    @Mapping(source = "status", target = "status")
    void fromUpdateAddressFormToEntity(UpdateAddressForm updateAddressForm, @MappingTarget Address address);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(source = "id", target = "id")
    @Mapping(source = "address", target = "address")
    @Mapping(source = "ward", target = "wardInfo", qualifiedByName = "fromEntityToAutoCompleteDto")
    @Mapping(source = "district", target = "districtInfo", qualifiedByName = "fromEntityToAutoCompleteDto")
    @Mapping(source = "province", target = "provinceInfo", qualifiedByName = "fromEntityToAutoCompleteDto")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "phone", target = "phone")
    AddressDto fromEntityToAddressDto(Address address);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(source = "id", target = "id")
    @Mapping(source = "address", target = "address")
    @Mapping(source = "ward", target = "wardInfo", qualifiedByName = "fromEntityToAdminDto")
    @Mapping(source = "district", target = "districtInfo", qualifiedByName = "fromEntityToAdminDto")
    @Mapping(source = "province", target = "provinceInfo", qualifiedByName = "fromEntityToAdminDto")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "phone", target = "phone")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "user", target = "userInfo", qualifiedByName = "fromUserToUserDto")
    @Named("fromEntityToAddressAdminDto")
    AddressAdminDto fromEntityToAddressAdminDto(Address address);
    @IterableMapping(elementTargetType = AddressAdminDto.class, qualifiedByName = "fromEntityToAddressAdminDto")
    List<AddressAdminDto> fromEntityToAddressAdminDtoList(List<Address> addresses);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(source = "id", target = "id")
    @Mapping(source = "address", target = "address")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "phone", target = "phone")
    @Mapping(source = "status", target = "status")
    @Named("fromEntityToAddressDtoAutoComplete")
    AddressDto fromEntityToAddressDtoAutoComplete(Address address);

    @IterableMapping(elementTargetType = AddressDto.class, qualifiedByName = "fromEntityToAddressDtoAutoComplete")
    List<AddressDto> fromEntityToAddressDtoAutoCompleteList(List<Address> addresses);

}
