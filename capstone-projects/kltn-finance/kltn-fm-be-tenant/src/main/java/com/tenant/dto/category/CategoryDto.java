package com.tenant.dto.category;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class CategoryDto {
    @ApiModelProperty(name = "id")
    private Long id;
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "description")
    private String description;
    @ApiModelProperty(name = "kind")
    private Integer kind;
}
