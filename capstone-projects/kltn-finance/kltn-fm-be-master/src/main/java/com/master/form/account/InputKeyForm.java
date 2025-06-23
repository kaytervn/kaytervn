package com.master.form.account;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class InputKeyForm {
    @NotBlank(message = "privateKey cannot be null")
    @ApiModelProperty(name = "privateKey", required = true)
    private String privateKey;
}
