package com.base.auth.mapper;

import com.base.auth.dto.address.AddressAdminDto;
import com.base.auth.dto.address.AddressDto;
import com.base.auth.form.address.CreateAddressForm;
import com.base.auth.form.address.UpdateAddressForm;
import com.base.auth.model.Address;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-06-30T13:02:31+0700",
    comments = "version: 1.3.1.Final, compiler: javac, environment: Java 11.0.22 (Oracle Corporation)"
)
@Component
public class AddressMapperImpl implements AddressMapper {

    @Autowired
    private NationMapper nationMapper;
    @Autowired
    private UserMapper userMapper;

    @Override
    public Address fromCreateAddressFormToEntity(CreateAddressForm createAddressForm) {
        if ( createAddressForm == null ) {
            return null;
        }

        Address address = new Address();

        address.setAddress( createAddressForm.getAddress() );
        address.setPhone( createAddressForm.getPhone() );
        address.setName( createAddressForm.getName() );
        if ( createAddressForm.getStatus() != null ) {
            address.setStatus( createAddressForm.getStatus() );
        }

        return address;
    }

    @Override
    public void fromUpdateAddressFormToEntity(UpdateAddressForm updateAddressForm, Address address) {
        if ( updateAddressForm == null ) {
            return;
        }

        if ( updateAddressForm.getAddress() != null ) {
            address.setAddress( updateAddressForm.getAddress() );
        }
        if ( updateAddressForm.getPhone() != null ) {
            address.setPhone( updateAddressForm.getPhone() );
        }
        if ( updateAddressForm.getName() != null ) {
            address.setName( updateAddressForm.getName() );
        }
        if ( updateAddressForm.getStatus() != null ) {
            address.setStatus( updateAddressForm.getStatus() );
        }
    }

    @Override
    public AddressDto fromEntityToAddressDto(Address address) {
        if ( address == null ) {
            return null;
        }

        AddressDto addressDto = new AddressDto();

        addressDto.setAddress( address.getAddress() );
        addressDto.setProvinceInfo( nationMapper.fromEntityToAutoCompleteDto( address.getProvince() ) );
        addressDto.setPhone( address.getPhone() );
        addressDto.setDistrictInfo( nationMapper.fromEntityToAutoCompleteDto( address.getDistrict() ) );
        addressDto.setName( address.getName() );
        addressDto.setId( address.getId() );
        addressDto.setWardInfo( nationMapper.fromEntityToAutoCompleteDto( address.getWard() ) );

        return addressDto;
    }

    @Override
    public AddressAdminDto fromEntityToAddressAdminDto(Address address) {
        if ( address == null ) {
            return null;
        }

        AddressAdminDto addressAdminDto = new AddressAdminDto();

        addressAdminDto.setUserInfo( userMapper.fromEntityToUserDto( address.getUser() ) );
        addressAdminDto.setAddress( address.getAddress() );
        addressAdminDto.setProvinceInfo( nationMapper.fromEntityToAdminDto( address.getProvince() ) );
        if ( address.getCreatedDate() != null ) {
            addressAdminDto.setCreatedDate( LocalDateTime.ofInstant( address.getCreatedDate().toInstant(), ZoneId.of( "UTC" ) ) );
        }
        addressAdminDto.setPhone( address.getPhone() );
        addressAdminDto.setDistrictInfo( nationMapper.fromEntityToAdminDto( address.getDistrict() ) );
        addressAdminDto.setName( address.getName() );
        if ( address.getModifiedDate() != null ) {
            addressAdminDto.setModifiedDate( LocalDateTime.ofInstant( address.getModifiedDate().toInstant(), ZoneId.of( "UTC" ) ) );
        }
        addressAdminDto.setId( address.getId() );
        addressAdminDto.setWardInfo( nationMapper.fromEntityToAdminDto( address.getWard() ) );
        addressAdminDto.setStatus( address.getStatus() );

        return addressAdminDto;
    }

    @Override
    public List<AddressAdminDto> fromEntityToAddressAdminDtoList(List<Address> addresses) {
        if ( addresses == null ) {
            return null;
        }

        List<AddressAdminDto> list = new ArrayList<AddressAdminDto>( addresses.size() );
        for ( Address address : addresses ) {
            list.add( fromEntityToAddressAdminDto( address ) );
        }

        return list;
    }

    @Override
    public AddressDto fromEntityToAddressDtoAutoComplete(Address address) {
        if ( address == null ) {
            return null;
        }

        AddressDto addressDto = new AddressDto();

        addressDto.setAddress( address.getAddress() );
        addressDto.setPhone( address.getPhone() );
        addressDto.setName( address.getName() );
        addressDto.setId( address.getId() );
        addressDto.setStatus( address.getStatus() );

        return addressDto;
    }

    @Override
    public List<AddressDto> fromEntityToAddressDtoAutoCompleteList(List<Address> addresses) {
        if ( addresses == null ) {
            return null;
        }

        List<AddressDto> list = new ArrayList<AddressDto>( addresses.size() );
        for ( Address address : addresses ) {
            list.add( fromEntityToAddressDtoAutoComplete( address ) );
        }

        return list;
    }
}
