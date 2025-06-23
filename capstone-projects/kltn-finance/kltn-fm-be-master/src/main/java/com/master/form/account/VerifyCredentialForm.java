package com.master.form.account;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class VerifyCredentialForm {
    @NotBlank(message = "username cannot be blank!!!")
    @ApiModelProperty(name = "username", required = true)
    private String username;
    @NotBlank(message = "password cannot be blank!!!")
    @ApiModelProperty(name = "password", required = true)
    private String password;
    private String tenantId = "";
}
