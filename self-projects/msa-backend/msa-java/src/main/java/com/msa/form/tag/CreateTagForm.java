package com.msa.form.tag;

import com.msa.constant.AppConstant;
import com.msa.validation.PatternConstraint;
import com.msa.validation.TagKind;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CreateTagForm {
    @NotBlank(message = "name cannot be blank")
    @ApiModelProperty(required = true)
    private String name;
    @PatternConstraint(pattern = AppConstant.HEX_COLOR_PATTERN)
    @ApiModelProperty(required = true)
    private String color;
    @TagKind
    @ApiModelProperty(required = true)
    private Integer kind;
}