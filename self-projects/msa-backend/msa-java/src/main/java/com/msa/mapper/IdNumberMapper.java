package com.msa.mapper;

import com.msa.dto.idNumber.IdNumberDto;
import com.msa.form.idNumber.CreateIdNumberForm;
import com.msa.form.idNumber.UpdateIdNumberForm;
import com.msa.storage.tenant.model.IdNumber;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {TagMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface IdNumberMapper {
    @Mapping(source = "name", target = "name")
    @Mapping(source = "code", target = "code")
    @Mapping(source = "note", target = "note")
    @BeanMapping(ignoreByDefault = true)
    IdNumber fromCreateIdNumberFormToEntity(CreateIdNumberForm createIdNumberForm);

    @Mapping(source = "name", target = "name")
    @Mapping(source = "code", target = "code")
    @Mapping(source = "note", target = "note")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateIdNumberFormToEntity(UpdateIdNumberForm updateIdNumberForm, @MappingTarget IdNumber idnumber);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "code", target = "code")
    @Mapping(source = "note", target = "note")
    @Mapping(source = "tag", target = "tag", qualifiedByName = "fromEntityToTagDtoAutoComplete")
    @Mapping(source = "createdDate", target = "createdDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToIdNumberDto")
    IdNumberDto fromEntityToIdNumberDto(IdNumber idnumber);

    @IterableMapping(elementTargetType = IdNumberDto.class, qualifiedByName = "fromEntityToIdNumberDto")
    List<IdNumberDto> fromEntityListToIdNumberDtoList(List<IdNumber> idnumberList);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "code", target = "code")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToIdNumberDtoAutoComplete")
    IdNumberDto fromEntityToIdNumberDtoAutoComplete(IdNumber idnumber);

    @IterableMapping(elementTargetType = IdNumberDto.class, qualifiedByName = "fromEntityToIdNumberDtoAutoComplete")
    List<IdNumberDto> fromEntityListToIdNumberDtoListAutoComplete(List<IdNumber> idnumberList);
}
