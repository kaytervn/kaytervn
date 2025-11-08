package com.msa.mapper;

import com.msa.dto.dbConfig.DbConfigDto;
import com.msa.storage.master.model.DbConfig;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface DbConfigMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "url", target = "url")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToDbConfigDtoAutoComplete")
    DbConfigDto fromEntityToDbConfigDtoAutoComplete(DbConfig dbconfig);
}
