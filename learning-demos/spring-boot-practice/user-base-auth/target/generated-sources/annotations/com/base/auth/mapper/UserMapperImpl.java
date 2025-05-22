package com.base.auth.mapper;

import com.base.auth.dto.user.UserAutoCompleteDto;
import com.base.auth.dto.user.UserDto;
import com.base.auth.model.User;
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
public class UserMapperImpl implements UserMapper {

    @Autowired
    private AccountMapper accountMapper;

    @Override
    public UserDto fromEntityToUserDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDto userDto = new UserDto();

        userDto.setBirthday( user.getBirthday() );
        userDto.setId( user.getId() );
        userDto.setAccount( accountMapper.fromAccountToDto( user.getAccount() ) );

        return userDto;
    }

    @Override
    public UserAutoCompleteDto fromUserToDtoAutoComplete(User user) {
        if ( user == null ) {
            return null;
        }

        UserAutoCompleteDto userAutoCompleteDto = new UserAutoCompleteDto();

        userAutoCompleteDto.setAccountAutoCompleteDto( accountMapper.fromAccountToAutoCompleteDto( user.getAccount() ) );
        userAutoCompleteDto.setId( user.getId() );

        return userAutoCompleteDto;
    }

    @Override
    public List<UserDto> fromUserListToUserDtoList(List<User> list) {
        if ( list == null ) {
            return null;
        }

        List<UserDto> list1 = new ArrayList<UserDto>( list.size() );
        for ( User user : list ) {
            list1.add( fromEntityToUserDto( user ) );
        }

        return list1;
    }

    @Override
    public List<UserAutoCompleteDto> fromUserListToUserDtoListAutocomplete(List<User> list) {
        if ( list == null ) {
            return null;
        }

        List<UserAutoCompleteDto> list1 = new ArrayList<UserAutoCompleteDto>( list.size() );
        for ( User user : list ) {
            list1.add( fromUserToDtoAutoComplete( user ) );
        }

        return list1;
    }
}
