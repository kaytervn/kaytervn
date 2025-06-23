package com.tenant.dto.serviceGroup;

import com.tenant.dto.ABasicAdminDto;
import com.tenant.dto.service.ServiceDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

@Data
public class ServiceGroupAdminDto extends ABasicAdminDto {
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "description")
    private String description;
    @ApiModelProperty(name = "services")
    private List<ServiceDto> services;
}
