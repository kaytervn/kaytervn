package com.tenant.mapper;

import com.tenant.dto.serviceSchedule.ServiceScheduleAdminDto;
import com.tenant.dto.serviceSchedule.ServiceScheduleDto;
import com.tenant.storage.tenant.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {ServiceMapper.class})
public interface ServiceScheduleMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "numberOfDueDays", target = "numberOfDueDays")
    @Mapping(source = "ordering", target = "ordering")
    @Mapping(source = "service", target = "service", qualifiedByName = "fromEntityToServiceDto")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToServiceScheduleAdminDto")
    ServiceScheduleAdminDto fromEntityToServiceScheduleAdminDto(ServiceSchedule serviceSchedule);

    @IterableMapping(elementTargetType = ServiceScheduleAdminDto.class, qualifiedByName = "fromEntityToServiceScheduleAdminDto")
    List<ServiceScheduleAdminDto> fromEntityListToServiceScheduleAdminDtoList(List<ServiceSchedule> serviceSchedules);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "numberOfDueDays", target = "numberOfDueDays")
    @Mapping(source = "ordering", target = "ordering")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToServiceScheduleDto")
    ServiceScheduleDto fromEntityToServiceScheduleDto(ServiceSchedule serviceSchedule);

    @IterableMapping(elementTargetType = ServiceScheduleDto.class, qualifiedByName = "fromEntityToServiceScheduleDto")
    List<ServiceScheduleDto> fromEntityListToServiceScheduleDtoList(List<ServiceSchedule> serviceSchedules);
}
