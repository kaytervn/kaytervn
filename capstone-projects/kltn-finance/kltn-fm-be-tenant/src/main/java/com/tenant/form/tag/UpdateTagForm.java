package com.tenant.form.tag;

import com.tenant.validation.ColorCodeConstraint;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class UpdateTagForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(name = "id", required = true)
    private Long id;
    @NotBlank(message = "name cannot be null")
    @ApiModelProperty(name = "name", required = true)
    private String name;
    @NotBlank(message = "colorCode cannot be null")
    @ColorCodeConstraint
    @ApiModelProperty(name = "colorCode", required = true)
    private String colorCode;
}
