package com.tenant.mapper;

import com.tenant.dto.permission.GroupPermissionDto;
import com.tenant.storage.tenant.model.GroupPermission;
import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring", uses = {GroupMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface GroupPermissionMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "permissionId", target = "permissionId")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToGroupPermissionDto")
    GroupPermissionDto fromEntityToGroupPermissionDto(GroupPermission grouppermission);

    @IterableMapping(elementTargetType = GroupPermissionDto.class, qualifiedByName = "fromEntityToGroupPermissionDto")
    @Named("fromEntityListToGroupPermissionDtoList")
    List<GroupPermissionDto> fromEntityListToGroupPermissionDtoList(List<GroupPermission> grouppermissionList);
}