package com.example.demo.mapper;

import com.example.demo.dto.request.RegisterRequest;
import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.response.RegisterResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.entity.User;
import com.example.demo.entity.VerificationToken;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {RoleMapper.class})
public interface UserMapper {
    User toUser(UserCreationRequest request);

    User toUser(RegisterRequest request);

    @Named("userToUserResponse")
    @Mapping(target = "roles", qualifiedByName = "roleToRoleResponseWithoutPermissions")
    @Mapping(target = "password", ignore = true)
    UserResponse toUserResponse(User user);

    @Mapping(target = "user", qualifiedByName = "userToUserResponse")
    RegisterResponse toRegisterResponse(VerificationToken verificationToken);

    @Named("userToUserResponseWithoutRole")
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "roles", ignore = true)
    UserResponse toUserResponseWithoutRole(User user);

    @Mapping(target = "roles", ignore = true)
    void updateUserFromDto(@MappingTarget User user, UserUpdateRequest request);

    @IterableMapping(qualifiedByName = "userToUserResponse")
    List<UserResponse> toUserResponseList(List<User> users);
}