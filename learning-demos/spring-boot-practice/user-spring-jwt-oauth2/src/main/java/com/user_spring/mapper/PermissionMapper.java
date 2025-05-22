package com.user_spring.mapper;

import com.user_spring.dto.request.PermissionRequest;
import com.user_spring.dto.response.PermissionResponse;
import com.user_spring.entity.Permission;
import com.user_spring.mapper.utils.MapperUtils;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {MapperUtils.class})
public interface PermissionMapper {
    @Mapping(target = "name", source = "name", qualifiedByName = "toUpperCase")
    Permission toPermission(PermissionRequest request);

    @Mapping(target = "name", source = "name", qualifiedByName = "toUpperCase")
    PermissionResponse toPermissionResponse(Permission permission);

    List<PermissionResponse> toPermissionResponseList(List<Permission> permissions);
}