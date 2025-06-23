package com.tenant.dto.serviceGroup;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ServiceGroupDto {
    @ApiModelProperty(name = "id")
    private Long id;
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "status")
    private Integer status;
}
