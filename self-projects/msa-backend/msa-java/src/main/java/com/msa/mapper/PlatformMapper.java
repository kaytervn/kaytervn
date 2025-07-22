package com.msa.mapper;

import com.msa.dto.platform.PlatformDto;
import com.msa.form.platform.CreatePlatformForm;
import com.msa.form.platform.UpdatePlatformForm;
import com.msa.storage.tenant.model.Platform;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PlatformMapper {
    @Mapping(source = "name", target = "name")
    @Mapping(source = "url", target = "url")
    @BeanMapping(ignoreByDefault = true)
    Platform fromCreatePlatformFormToEntity(CreatePlatformForm createPlatformForm);

    @Mapping(source = "name", target = "name")
    @Mapping(source = "url", target = "url")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdatePlatformFormToEntity(UpdatePlatformForm updatePlatformForm, @MappingTarget Platform platform);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "url", target = "url")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "totalAccounts", target = "totalAccounts")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToPlatformDto")
    PlatformDto fromEntityToPlatformDto(Platform platform);

    @IterableMapping(elementTargetType = PlatformDto.class, qualifiedByName = "fromEntityToPlatformDto")
    List<PlatformDto> fromEntityListToPlatformDtoList(List<Platform> platformList);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToPlatformDtoAutoComplete")
    PlatformDto fromEntityToPlatformDtoAutoComplete(Platform platform);

    @IterableMapping(elementTargetType = PlatformDto.class, qualifiedByName = "fromEntityToPlatformDtoAutoComplete")
    List<PlatformDto> fromEntityListToPlatformDtoListAutoComplete(List<Platform> platformList);
}
