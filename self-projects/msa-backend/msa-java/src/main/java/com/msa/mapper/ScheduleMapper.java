package com.msa.mapper;

import com.msa.dto.schedule.ScheduleDto;
import com.msa.form.schedule.CreateScheduleForm;
import com.msa.form.schedule.UpdateScheduleForm;
import com.msa.storage.tenant.model.Schedule;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {TagMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ScheduleMapper {
    @Mapping(source = "name", target = "name")
    @Mapping(source = "sender", target = "sender")
    @Mapping(source = "content", target = "content")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "time", target = "time")
    @BeanMapping(ignoreByDefault = true)
    Schedule fromCreateScheduleFormToEntity(CreateScheduleForm createScheduleForm);

    @Mapping(source = "name", target = "name")
    @Mapping(source = "sender", target = "sender")
    @Mapping(source = "content", target = "content")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "time", target = "time")
    @BeanMapping(ignoreByDefault = true)
    void fromUpdateScheduleFormToEntity(UpdateScheduleForm updateScheduleForm, @MappingTarget Schedule schedule);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "sender", target = "sender")
    @Mapping(source = "emails", target = "emails")
    @Mapping(source = "content", target = "content")
    @Mapping(source = "kind", target = "kind")
    @Mapping(source = "amount", target = "amount")
    @Mapping(source = "time", target = "time")
    @Mapping(source = "checkedDate", target = "checkedDate")
    @Mapping(source = "dueDate", target = "dueDate")
    @Mapping(source = "type", target = "type")
    @Mapping(source = "isSent", target = "isSent")
    @Mapping(source = "tag", target = "tag", qualifiedByName = "fromEntityToTagDtoAutoComplete")
    @Mapping(source = "createdDate", target = "createdDate")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToScheduleDto")
    ScheduleDto fromEntityToScheduleDto(Schedule schedule);

    @IterableMapping(elementTargetType = ScheduleDto.class, qualifiedByName = "fromEntityToScheduleDto")
    List<ScheduleDto> fromEntityListToScheduleDtoList(List<Schedule> scheduleList);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityToScheduleDtoAutoComplete")
    ScheduleDto fromEntityToScheduleDtoAutoComplete(Schedule schedule);

    @IterableMapping(elementTargetType = ScheduleDto.class, qualifiedByName = "fromEntityToScheduleDtoAutoComplete")
    List<ScheduleDto> fromEntityListToScheduleDtoListAutoComplete(List<Schedule> scheduleList);
}
