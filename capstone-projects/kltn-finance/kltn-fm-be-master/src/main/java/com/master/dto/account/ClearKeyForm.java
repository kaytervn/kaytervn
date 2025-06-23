package com.master.dto.account;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ClearKeyForm {
    @NotBlank(message = "password cannot be blank")
    @ApiModelProperty(required = true)
    private String password;
}
