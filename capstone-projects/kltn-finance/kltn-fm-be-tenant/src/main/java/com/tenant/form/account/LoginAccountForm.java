package com.tenant.form.account;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class LoginAccountForm {
    @NotBlank(message = "username cannot be null")
    @ApiModelProperty(name = "username")
    private String username;
    @NotBlank(message = "password cannot be null")
    @ApiModelProperty(name = "password")
    private String password;
//    @NotBlank(message = "userId cannot be null")
//    @ApiModelProperty(name = "userId")
//    private String userId;
    @NotBlank(message = "grant_type cannot be null")
    @ApiModelProperty(name = "grant_type")
    private String grant_type;
}
