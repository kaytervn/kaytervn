package com.base.auth.form.service;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
@ApiModel
public class CreateServiceForm {
    @NotEmpty(message = "username cant not be null")
    @ApiModelProperty(name = "username", required = true)
    private String username;
    @Email
    @ApiModelProperty(name = "email")
    private String email;
    @NotEmpty(message = "password cant not be null")
    @ApiModelProperty(name = "password", required = true)
    private String password;
    @NotEmpty(message = "fullName cant not be null")
    @ApiModelProperty(name = "fullName", required = true)
    private String fullName;
    @NotEmpty(message = "phone cant not be null")
    @ApiModelProperty(name = "phone", required = true)
    private String phone;
    @ApiModelProperty(name = "avatarPath")
    private String avatarPath;
    @NotEmpty(message = "tenantId cant not be null")
    @ApiModelProperty(name = "tenantId", required = true)
    private String tenantId;

    @NotEmpty(message = "serviceName cant not be null")
    @ApiModelProperty(name = "serviceName", required = true)
    private String serviceName;
    @NotEmpty(message = "logoPath cant not be null")
    @ApiModelProperty(name = "logoPath", required = true)
    private String logoPath;
    @ApiModelProperty(name = "bannerPath")
    private String bannerPath;
    @ApiModelProperty(name = "hotline")
    private String hotline;
    @ApiModelProperty(name = "settings")
    private String settings="{}";
    @NotEmpty(message = "lang cant not be null")
    @ApiModelProperty(name = "lang", required = true)
    private String lang;
    @NotNull(message = "status cant not be null")
    @ApiModelProperty(name = "status", required = true)
    private Integer status;
}
