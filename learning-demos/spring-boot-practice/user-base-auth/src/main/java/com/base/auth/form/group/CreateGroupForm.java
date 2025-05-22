package com.base.auth.form.group;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
@ApiModel
public class CreateGroupForm {
    @NotEmpty(message = "Name cant not be null")
    @ApiModelProperty(name = "name", required = true)
    private String name;
    @NotEmpty(message = "description cant not be null")
    @ApiModelProperty(name = "description", required = true)
    private String description;
    @NotNull(message = "permissions cant not be null")
    @ApiModelProperty(name = "permissions", required = true)
    private Long[] permissions;
    @NotNull(message = "kind cant not be null")
    @ApiModelProperty(name = "kind", required = true)
    private Integer kind;
}
