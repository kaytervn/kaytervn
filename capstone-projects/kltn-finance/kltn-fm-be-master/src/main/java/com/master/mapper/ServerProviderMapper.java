package com.master.mapper;

import com.master.form.serverProvider.CreateServerProviderForm;
import com.master.form.serverProvider.UpdateServerProviderForm;
import com.master.model.ServerProvider;
import com.master.dto.serverProvider.ServerProviderAdminDto;
import com.master.dto.serverProvider.ServerProviderDto;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ServerProviderMapper {
    @Mapping(target = "name", source = "name")
    @Mapping(target = "url", source = "url")
    @Mapping(target = "maxTenant", source = "maxTenant")
    @Mapping(target = "mySqlRootUser", source = "mySqlRootUser")
    @Mapping(target = "mySqlRootPassword", source = "mySqlRootPassword")
    @BeanMapping(ignoreByDefault = true)
    ServerProvider fromCreateServerProviderFormToEntity(CreateServerProviderForm createServerProviderForm);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "url", source = "url")
    @Mapping(target = "maxTenant", source = "maxTenant")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateServerProviderFormToEntity(UpdateServerProviderForm updateServerProviderForm, @MappingTarget ServerProvider serverProvider);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "url", source = "url")
    @Mapping(target = "maxTenant", source = "maxTenant")
    @Mapping(target = "currentTenantCount", source = "currentTenantCount")
    @Mapping(target = "mySqlJdbcUrl", source = "mySqlJdbcUrl")
    @Mapping(target = "mySqlRootUser", source = "mySqlRootUser")
    @Mapping(target = "mySqlRootPassword", source = "mySqlRootPassword")
    @Mapping(target = "driverClassName", source = "driverClassName")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "createdDate", source = "createdDate")
    @Mapping(target = "modifiedDate", source = "modifiedDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToServerProviderAdminDto")
    ServerProviderAdminDto fromEntityToServerProviderAdminDto(ServerProvider serverProvider);

    @IterableMapping(elementTargetType = ServerProviderAdminDto.class, qualifiedByName = "fromEntityToServerProviderAdminDto")
    List<ServerProviderAdminDto> fromEntityListToServerProviderAdminDtoList(List<ServerProvider> serverProviders);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "url", source = "url")
    @Mapping(target = "driverClassName", source = "driverClassName")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToServerProviderDto")
    ServerProviderDto fromEntityToServerProviderDto(ServerProvider serverProvider);

    @IterableMapping(elementTargetType = ServerProviderDto.class, qualifiedByName = "fromEntityToServerProviderDto")
    List<ServerProviderDto> fromEntityListToServerProviderDtoList(List<ServerProvider> serverProviders);
}

