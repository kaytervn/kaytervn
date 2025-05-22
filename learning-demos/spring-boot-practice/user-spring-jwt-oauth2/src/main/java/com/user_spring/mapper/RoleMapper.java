package com.user_spring.mapper;

import com.user_spring.dto.request.RoleRequest;
import com.user_spring.dto.response.RoleResponse;
import com.user_spring.entity.Role;
import com.user_spring.mapper.utils.MapperUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring", uses = {MapperUtils.class})
public interface RoleMapper {
    @Mapping(target = "name", source = "name", qualifiedByName = "toUpperCase")
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    @Named("roleToRoleResponse")
    @Mapping(target = "name", source = "name", qualifiedByName = "toUpperCase")
    RoleResponse toRoleResponse(Role role);

    List<RoleResponse> toRoleResponseList(List<Role> roles);
}