package com.master.mapper;

import com.master.form.dbConfig.CreateDbConfigForm;
import com.master.form.dbConfig.UpdateDbConfigForm;
import com.master.model.DbConfig;
import com.master.dto.dbConfig.DbConfigAdminDto;
import com.master.dto.dbConfig.DbConfigDto;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {ServerProviderMapper.class, LocationMapper.class})
public interface DbConfigMapper {
    @Mapping(target = "maxConnection", source = "maxConnection")
    @Mapping(target = "initialize", source = "initialize")
    @BeanMapping(ignoreByDefault = true)
    DbConfig fromCreateDbConfigFormToEntity(CreateDbConfigForm createDbConfigForm);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "maxConnection", source = "maxConnection")
    @Mapping(target = "initialize", source = "initialize")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateDbConfigFormToEntity(UpdateDbConfigForm updateDbConfigForm, @MappingTarget DbConfig dbConfig);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "url", source = "url")
    @Mapping(target = "username", source = "username")
    @Mapping(target = "password", source = "password")
    @Mapping(target = "maxConnection", source = "maxConnection")
    @Mapping(target = "driverClassName", source = "driverClassName")
    @Mapping(target = "initialize", source = "initialize")
    @Mapping(target = "serverProvider", source = "serverProvider", qualifiedByName = "fromEntityToServerProviderDto")
    @Mapping(target = "location", source = "location", qualifiedByName = "fromEntityToLocationDto")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "createdDate", source = "createdDate")
    @Mapping(target = "modifiedDate", source = "modifiedDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToDbConfigAdminDto")
    DbConfigAdminDto fromEntityToDbConfigAdminDto(DbConfig dbConfig);

    @IterableMapping(elementTargetType = DbConfigAdminDto.class, qualifiedByName = "fromEntityToDbConfigAdminDto")
    List<DbConfigAdminDto> fromEntityListToDbConfigAdminDtoList(List<DbConfig> dbConfigs);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "username", source = "username")
    @Mapping(target = "url", source = "url")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToDbConfigDto")
    DbConfigDto fromEntityToDbConfigDto(DbConfig dbConfig);

    @IterableMapping(elementTargetType = DbConfigDto.class, qualifiedByName = "fromEntityToDbConfigDto")
    List<DbConfigDto> fromEntityListToDbConfigDtoList(List<DbConfig> dbConfigs);
}
