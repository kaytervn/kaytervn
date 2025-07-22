package com.msa.mapper;

import com.msa.dto.permission.PermissionDto;
import com.msa.form.permission.CreatePermissionForm;
import com.msa.storage.master.model.Permission;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PermissionMapper {
    @Mapping(source = "name", target = "name")
    @Mapping(source = "nameGroup", target = "nameGroup")
    @Mapping(source = "permissionCode", target = "permissionCode")
    @Mapping(source = "kind", target = "kind")
    @BeanMapping(ignoreByDefault = true)
    Permission fromCreatePermissionFormToEntity(CreatePermissionForm createPermissionForm);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "nameGroup", target = "nameGroup")
    @Mapping(source = "permissionCode", target = "permissionCode")
    @Mapping(source = "kind", target = "kind")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToPermissionDto")
    PermissionDto fromEntityToPermissionDto(Permission permission);

    @IterableMapping(elementTargetType = PermissionDto.class, qualifiedByName = "fromEntityToPermissionDto")
    List<PermissionDto> fromEntityListToPermissionDtoList(List<Permission> permissionList);
}