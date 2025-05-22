package com.user_spring.mapper;

import com.user_spring.dto.response.UserResponse;
import com.user_spring.dto.request.UserCreationRequest;
import com.user_spring.dto.request.UserUpdateRequest;
import com.user_spring.mapper.utils.MapperUtils;
import com.user_spring.entity.User;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {MapperUtils.class, RoleMapper.class})
public interface UserMapper {
    @Mapping(target = "gender", source = "gender", qualifiedByName = "toUpperCase")
    User toUser(UserCreationRequest request);

    @Named("userToUserResponse")
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "roles", qualifiedByName = "roleToRoleResponse")
    UserResponse toUserResponse(User user);

    @Mapping(target = "gender", source = "gender", qualifiedByName = "toUpperCase")
    @Mapping(target = "roles", ignore = true)
    void updateUserFromDto(@MappingTarget User user, UserUpdateRequest request);

    @IterableMapping(qualifiedByName = "userToUserResponse")
    List<UserResponse> toUserResponseList(List<User> users);
}