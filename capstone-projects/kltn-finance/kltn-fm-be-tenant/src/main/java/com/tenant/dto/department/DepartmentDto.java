package com.tenant.dto.department;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class DepartmentDto {
    @ApiModelProperty(name = "id")
    private Long id;
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "description")
    private String description;
}
