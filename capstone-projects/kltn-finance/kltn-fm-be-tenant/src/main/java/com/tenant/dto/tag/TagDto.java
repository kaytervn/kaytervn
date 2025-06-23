package com.tenant.dto.tag;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class TagDto {
    @ApiModelProperty(name = "id")
    private Long id;
    @ApiModelProperty(name = "kind")
    private Integer kind;
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "colorCode")
    private String colorCode;
}
