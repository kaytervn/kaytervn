package com.example.demo.mapper;

import com.example.demo.dto.request.RoleRequest;
import com.example.demo.dto.response.RoleResponse;
import com.example.demo.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    @Named("roleToRoleResponse")
    RoleResponse toRoleResponse(Role role);

    @Named("roleToRoleResponseWithoutPermissions")
    @Mapping(target = "permissions", ignore = true)
    RoleResponse toRoleResponseWithoutPermissions(Role role);

    List<RoleResponse> toRoleResponseList(List<Role> roles);
}