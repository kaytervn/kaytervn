package com.msa.mapper;

import com.msa.dto.user.UserDto;
import com.msa.form.user.CreateUserForm;
import com.msa.form.user.UpdateProfileForm;
import com.msa.form.user.UpdateUserForm;
import com.msa.storage.master.model.User;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {GroupMapper.class, DbConfigMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper extends ABasicMapper {
    @Mapping(source = "username", target = "username")
    @Mapping(source = "fullName", target = "fullName")
    @Mapping(source = "avatarPath", target = "avatarPath")
    @Mapping(source = "email", target = "email")
    @BeanMapping(ignoreByDefault = true)
    User fromCreateUserFormToEntity(CreateUserForm createUserForm);

    @Mapping(source = "email", target = "email")
    @Mapping(source = "status", target = "status")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateUserFormToEntity(UpdateUserForm updateUserForm, @MappingTarget User user);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "username", target = "username")
    @Mapping(source = "fullName", target = "fullName")
    @Mapping(source = "avatarPath", target = "avatarPath")
    @Mapping(source = "email", target = "email")
    @Mapping(source = "group", target = "group", qualifiedByName = "fromEntityToGroupDtoAutoComplete")
    @Mapping(source = "dbConfig", target = "dbConfig", qualifiedByName = "fromEntityToDbConfigDtoAutoComplete")
    @Mapping(source = "lastLogin", target = "lastLogin")
    @Mapping(source = "isSuperAdmin", target = "isSuperAdmin")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToUserDto")
    UserDto fromEntityToUserDto(User user);

    @IterableMapping(elementTargetType = UserDto.class, qualifiedByName = "fromEntityToUserDto")
    List<UserDto> fromEntityListToUserDtoList(List<User> userList);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "fullName", target = "fullName")
    @Mapping(source = "username", target = "username")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToUserDtoAutoComplete")
    UserDto fromEntityToUserDtoAutoComplete(User user);

    @IterableMapping(elementTargetType = UserDto.class, qualifiedByName = "fromEntityToUserDtoAutoComplete")
    List<UserDto> fromEntityListToUserDtoListAutoComplete(List<User> userList);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "username", target = "username")
    @Mapping(source = "fullName", target = "fullName")
    @Mapping(source = "avatarPath", target = "avatarPath")
    @Mapping(source = "email", target = "email")
    @Mapping(source = "group", target = "group", qualifiedByName = "fromEntityToGroupDtoAutoComplete")
    @Mapping(source = "dbConfig", target = "dbConfig", qualifiedByName = "fromEntityToDbConfigDtoAutoComplete")
    @Mapping(source = "status", target = "status")
    @BeanMapping(ignoreByDefault = true)
    UserDto fromEntityToUserDtoForProfile(User user);

    @Mapping(source = "fullName", target = "fullName")
    @Mapping(source = "avatarPath", target = "avatarPath")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateProfileFormToEntity(UpdateProfileForm form, @MappingTarget User user);
}