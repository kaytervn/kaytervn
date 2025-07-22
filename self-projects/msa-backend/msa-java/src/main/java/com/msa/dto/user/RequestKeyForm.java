package com.msa.dto.user;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class RequestKeyForm {
    @NotBlank(message = "password cannot be null.")
    @ApiModelProperty(name = "password", required = true)
    private String password;
}
