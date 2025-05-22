package com.base.auth.form.account;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

@Data
@ApiModel
public class ForgetPasswordForm {
    @NotEmpty(message = "OPT can not be null.")
    @ApiModelProperty(name = "otp", required = true)
    private String otp;

    @NotEmpty(message = "Email can not be null.")
    @ApiModelProperty(name = "idHash", required = true)
    private String idHash;

    @NotEmpty(message = "newPassword can not be null")
    @Size(min = 6, message = "newPassword minimum 6 character.")
    @ApiModelProperty(name = "newPassword", required = true)
    private String newPassword;
}
