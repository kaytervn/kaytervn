package com.master.mapper;

import com.master.form.location.CreateLocationForm;
import com.master.form.location.UpdateLocationByCustomer;
import com.master.form.location.UpdateLocationForm;
import com.master.model.Location;
import com.master.dto.location.LocationAdminDto;
import com.master.dto.location.LocationDto;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {CustomerMapper.class, DbConfigMapper.class})
public interface LocationMapper {
    @Mapping(source = "tenantId", target = "tenantId")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "logoPath", target = "logoPath")
    @Mapping(source = "hotline", target = "hotline")
    @Mapping(source = "startDate", target = "startDate")
    @Mapping(source = "expiredDate", target = "expiredDate")
    @Mapping(source = "status", target = "status")
    @BeanMapping(ignoreByDefault = true)
    Location fromCreateLocationFormToEntity(CreateLocationForm createLocationForm);

    @Mapping(source = "name", target = "name")
    @Mapping(source = "logoPath", target = "logoPath")
    @Mapping(source = "hotline", target = "hotline")
    @Mapping(source = "startDate", target = "startDate")
    @Mapping(source = "expiredDate", target = "expiredDate")
    @Mapping(source = "status", target = "status")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateLocationFormToEntity(UpdateLocationForm updateLocationForm, @MappingTarget Location location);

    @Mapping(source = "name", target = "name")
    @Mapping(source = "logoPath", target = "logoPath")
    @Mapping(source = "hotline", target = "hotline")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateLocationFormByCustomerToEntity(UpdateLocationByCustomer updateLocationForm, @MappingTarget Location location);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "tenantId", source = "tenantId")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "logoPath", source = "logoPath")
    @Mapping(target = "hotline", source = "hotline")
    @Mapping(target = "settings", source = "settings")
    @Mapping(target = "customer", source = "customer", qualifiedByName = "fromEntityToCustomerDto")
    @Mapping(target = "dbConfig", source = "dbConfig", qualifiedByName = "fromEntityToDbConfigDto")
    @Mapping(source = "startDate", target = "startDate")
    @Mapping(source = "expiredDate", target = "expiredDate")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "createdDate", source = "createdDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToLocationAdminDto")
    LocationAdminDto fromEntityToLocationAdminDto(Location location);

    @IterableMapping(elementTargetType = LocationAdminDto.class, qualifiedByName = "fromEntityToLocationAdminDto")
    List<LocationAdminDto> fromEntityListToLocationAdminDtoList(List<Location> locations);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "tenantId", source = "tenantId")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "logoPath", source = "logoPath")
    @Mapping(target = "hotline", source = "hotline")
    @Mapping(source = "startDate", target = "startDate")
    @Mapping(source = "expiredDate", target = "expiredDate")
    @Mapping(target = "status", source = "status")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToLocationDto")
    LocationDto fromEntityToLocationDto(Location location);

    @IterableMapping(elementTargetType = LocationDto.class, qualifiedByName = "fromEntityToLocationDto")
    List<LocationDto> fromEntityListToLocationDtoList(List<Location> locations);
}
