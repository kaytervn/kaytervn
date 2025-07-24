package com.msa.form.idNumber;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CreateIdNumberForm {
    @NotBlank(message = "name cannot be blank")
    @ApiModelProperty(required = true)
    private String name;
    @NotBlank(message = "code cannot be blank")
    @ApiModelProperty(required = true)
    private String code;
    private String note;
    private Long tagId;
}
