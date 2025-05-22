package com.base.auth.form.group;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
@ApiModel
public class UpdateGroupForm {
    @NotNull(message = "id cant not be null")
    @ApiModelProperty(name = "id", required = true)
    private Long id;
    @NotNull(message = "name cant not be null")
    @ApiModelProperty(name = "name", required = true)
    private String name;
    @ApiModelProperty(name = "description")
    private String description;
    @NotNull(message = "permissions cant not be null")
    @ApiModelProperty(name = "permissions", required = true)
    private Long[] permissions;
}
