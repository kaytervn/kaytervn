package com.tenant.dto.organization;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class OrganizationDto {
    @ApiModelProperty(name = "id")
    private Long id;
    @ApiModelProperty(name = "name")
    private String name;
}
