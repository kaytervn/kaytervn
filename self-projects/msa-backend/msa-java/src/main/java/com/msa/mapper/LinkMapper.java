package com.msa.mapper;

import com.msa.dto.link.LinkDto;
import com.msa.form.link.CreateLinkForm;
import com.msa.form.link.UpdateLinkForm;
import com.msa.storage.tenant.model.Link;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {TagMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface LinkMapper {
    @Mapping(source = "name", target = "name")
    @Mapping(source = "link", target = "link")
    @Mapping(source = "note", target = "note")
    @BeanMapping(ignoreByDefault = true)
    Link fromCreateLinkFormToEntity(CreateLinkForm createLinkForm);

    @Mapping(source = "name", target = "name")
    @Mapping(source = "link", target = "link")
    @Mapping(source = "note", target = "note")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateLinkFormToEntity(UpdateLinkForm updateLinkForm, @MappingTarget Link link);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "link", target = "link")
    @Mapping(source = "note", target = "note")
    @Mapping(source = "tag", target = "tag", qualifiedByName = "fromEntityToTagDtoAutoComplete")
    @Mapping(source = "createdDate", target = "createdDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToLinkDto")
    LinkDto fromEntityToLinkDto(Link link);

    @IterableMapping(elementTargetType = LinkDto.class, qualifiedByName = "fromEntityToLinkDto")
    List<LinkDto> fromEntityListToLinkDtoList(List<Link> linkList);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "link", target = "link")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToLinkDtoAutoComplete")
    LinkDto fromEntityToLinkDtoAutoComplete(Link link);

    @IterableMapping(elementTargetType = LinkDto.class, qualifiedByName = "fromEntityToLinkDtoAutoComplete")
    List<LinkDto> fromEntityListToLinkDtoListAutoComplete(List<Link> linkList);
}
