package com.msa.mapper;

import com.msa.dto.software.SoftwareDto;
import com.msa.form.software.CreateSoftwareForm;
import com.msa.form.software.UpdateSoftwareForm;
import com.msa.storage.tenant.model.Software;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {TagMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface SoftwareMapper {
    @Mapping(source = "name", target = "name")
    @Mapping(source = "link", target = "link")
    @Mapping(source = "note", target = "note")
    @BeanMapping(ignoreByDefault = true)
    Software fromCreateSoftwareFormToEntity(CreateSoftwareForm createSoftwareForm);

    @Mapping(source = "name", target = "name")
    @Mapping(source = "link", target = "link")
    @Mapping(source = "note", target = "note")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateSoftwareFormToEntity(UpdateSoftwareForm updateSoftwareForm, @MappingTarget Software software);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "link", target = "link")
    @Mapping(source = "note", target = "note")
    @Mapping(source = "tag", target = "tag", qualifiedByName = "fromEntityToTagDtoAutoComplete")
    @Mapping(source = "createdDate", target = "createdDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToSoftwareDto")
    SoftwareDto fromEntityToSoftwareDto(Software software);

    @IterableMapping(elementTargetType = SoftwareDto.class, qualifiedByName = "fromEntityToSoftwareDto")
    List<SoftwareDto> fromEntityListToSoftwareDtoList(List<Software> softwareList);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToSoftwareDtoAutoComplete")
    SoftwareDto fromEntityToSoftwareDtoAutoComplete(Software software);

    @IterableMapping(elementTargetType = SoftwareDto.class, qualifiedByName = "fromEntityToSoftwareDtoAutoComplete")
    List<SoftwareDto> fromEntityListToSoftwareDtoListAutoComplete(List<Software> softwareList);
}
