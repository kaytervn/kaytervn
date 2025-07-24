package com.msa.form.tag;

import com.msa.constant.AppConstant;
import com.msa.validation.PatternConstraint;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class UpdateTagForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(required = true)
    private Long id;
    @NotBlank(message = "name cannot be blank")
    @ApiModelProperty(required = true)
    private String name;
    @PatternConstraint(pattern = AppConstant.HEX_COLOR_PATTERN)
    @ApiModelProperty(required = true)
    private String color;
}
