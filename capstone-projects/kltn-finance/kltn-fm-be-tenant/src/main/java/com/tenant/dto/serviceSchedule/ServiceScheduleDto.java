package com.tenant.dto.serviceSchedule;

import com.tenant.dto.service.ServiceDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ServiceScheduleDto {
    @ApiModelProperty(name = "id")
    private Long id;
    @ApiModelProperty(name = "numberOfDueDays")
    private Integer numberOfDueDays;
    @ApiModelProperty(name = "ordering")
    private Integer ordering;
    @ApiModelProperty(name = "service")
    private ServiceDto service;
}
