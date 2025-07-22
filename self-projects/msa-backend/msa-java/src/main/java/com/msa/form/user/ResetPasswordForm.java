package com.msa.form.user;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@ApiModel
public class ResetPasswordForm {
    @NotBlank(message = "otp cannot be null")
    @ApiModelProperty(name = "otp", required = true)
    private String otp;
    @NotBlank(message = "userId cannot be null")
    @ApiModelProperty(name = "userId", required = true)
    private String userId;
    @NotBlank(message = "newPassword cannot be null")
    @Size(min = 6, message = "newPassword must be 6 characters")
    @ApiModelProperty(name = "newPassword", required = true)
    private String newPassword;
}
