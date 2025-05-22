package com.base.auth.dto.account;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

@Data
@ApiModel
public class RequestForgetPasswordForm {

    @NotEmpty(message = "Email can not be null.")
    @Email
    @ApiModelProperty(name = "email", required = true)
    private String email;
}
