package com.base.auth.form.service;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;

@Data
public class UpdateProfileServiceForm {
    @ApiModelProperty(name = "email" )
    private String email;
    @ApiModelProperty(name = "password" )
    private String password;
    @NotEmpty(message = "oldPassword cant not be null")
    @ApiModelProperty(name = "oldPassword", required = true)
    private String oldPassword;
    @NotEmpty(message = "serviceName cant not be null")
    @ApiModelProperty(name = "serviceName", required = true)
    private String serviceName;
    @ApiModelProperty(name = "hotline")
    private String hotline;
    @ApiModelProperty(name = "bannerPath")
    private String bannerPath;
    @NotEmpty(message = "fullName cant not be null")
    @ApiModelProperty(name = "fullName", required = true)
    private String fullName;
    @NotEmpty(message = "phone cant not be null")
    @ApiModelProperty(name = "phone", required = true)
    private String phone;
    @ApiModelProperty(name = "avatarPath")
    private String avatarPath ;
    @NotEmpty(message = "logo cant not be null")
    @ApiModelProperty(name = "logo", required = true)
    private String logo;
}
