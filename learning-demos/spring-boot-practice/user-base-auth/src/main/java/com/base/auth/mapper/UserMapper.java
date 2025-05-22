package com.base.auth.mapper;

import com.base.auth.dto.user.UserAutoCompleteDto;
import com.base.auth.dto.user.UserDto;
import com.base.auth.model.User;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",uses = {AccountMapper.class})
public interface UserMapper {

    @Mapping(source = "id",target = "id")
    @Mapping(source = "birthday",target = "birthday", dateFormat = "yyyy-MM-dd")
    @Mapping(source ="account",target = "account",qualifiedByName="fromAccountToDto")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromUserToUserDto")
    UserDto fromEntityToUserDto(User user);

    @Mapping(source = "id",target = "id")
    @Mapping(source ="account",target = "accountAutoCompleteDto",qualifiedByName="fromAccountToAutoCompleteDto")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromUserToUserDtoAutoComplete")
    UserAutoCompleteDto fromUserToDtoAutoComplete(User user);




    @IterableMapping(elementTargetType = UserDto.class,qualifiedByName = "fromUserToUserDto")
    @BeanMapping(ignoreByDefault = true)
    List<UserDto> fromUserListToUserDtoList(List<User> list);

    @IterableMapping(elementTargetType = UserAutoCompleteDto.class,qualifiedByName = "fromUserToUserDtoAutoComplete")
    @BeanMapping(ignoreByDefault = true)
    List<UserAutoCompleteDto> fromUserListToUserDtoListAutocomplete(List<User> list);
}
