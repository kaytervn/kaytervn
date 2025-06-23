package com.tenant.form.keyInformation;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class EncryptedValueForm {
    @NotBlank(message = "value cannot be null")
    @ApiModelProperty(name = "value", required = true)
    private String value;
}
