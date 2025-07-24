package com.msa.mapper;

import com.msa.dto.tag.TagDto;
import com.msa.form.tag.CreateTagForm;
import com.msa.form.tag.UpdateTagForm;
import com.msa.storage.tenant.model.Tag;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TagMapper {
    @Mapping(source = "name", target = "name")
    @Mapping(source = "color", target = "color")
    @Mapping(source = "kind", target = "kind")
    @BeanMapping(ignoreByDefault = true)
    Tag fromCreateTagFormToEntity(CreateTagForm createTagForm);

    @Mapping(source = "name", target = "name")
    @Mapping(source = "color", target = "color")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateTagFormToEntity(UpdateTagForm updateTagForm, @MappingTarget Tag tag);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "color", target = "color")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "createdDate", target = "createdDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToTagDto")
    TagDto fromEntityToTagDto(Tag tag);

    @IterableMapping(elementTargetType = TagDto.class, qualifiedByName = "fromEntityToTagDto")
    List<TagDto> fromEntityListToTagDtoList(List<Tag> tagList);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "color", target = "color")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToTagDtoAutoComplete")
    TagDto fromEntityToTagDtoAutoComplete(Tag tag);

    @IterableMapping(elementTargetType = TagDto.class, qualifiedByName = "fromEntityToTagDtoAutoComplete")
    List<TagDto> fromEntityListToTagDtoListAutoComplete(List<Tag> tagList);
}
