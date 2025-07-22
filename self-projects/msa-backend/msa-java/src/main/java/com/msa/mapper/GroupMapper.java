package com.msa.mapper;

import com.msa.dto.group.GroupDto;
import com.msa.form.group.CreateGroupForm;
import com.msa.form.group.UpdateGroupForm;
import com.msa.storage.master.model.Group;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {PermissionMapper.class})
public interface GroupMapper {
    @Mapping(source = "name", target = "name")
    @BeanMapping(ignoreByDefault = true)
    Group fromCreateGroupFormToEntity(CreateGroupForm createGroupForm);

    @Mapping(source = "name", target = "name")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateGroupFormToEntity(UpdateGroupForm updateGroupForm, @MappingTarget Group group);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "permissions", target = "permissions", qualifiedByName = "fromEntityListToPermissionDtoList")
    @BeanMapping(ignoreByDefault = true)
    GroupDto fromEntityToGroupDto(Group group);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(source = "isSystem", target = "isSystem")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToGroupDtoForList")
    GroupDto fromEntityToGroupDtoForList(Group group);

    @IterableMapping(elementTargetType = GroupDto.class, qualifiedByName = "fromEntityToGroupDtoForList")
    List<GroupDto> fromEntityListToGroupDtoList(List<Group> groupList);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "kind", target = "kind")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToGroupDtoAutoComplete")
    GroupDto fromEntityToGroupDtoAutoComplete(Group group);

    @IterableMapping(elementTargetType = GroupDto.class, qualifiedByName = "fromEntityToGroupDtoAutoComplete")
    List<GroupDto> fromEntityListToGroupDtoListAutoComplete(List<Group> groupList);
}