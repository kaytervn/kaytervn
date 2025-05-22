package com.base.auth.form.service;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
@ApiModel
public class UpdateServiceForm {
    @NotNull(message = "id cant not be null")
    @ApiModelProperty(name = "id", required = true)
    private Long  id;
    @NotEmpty(message = "tenantId cant not be null")
    @ApiModelProperty(name = "tenantId", required = true)
    private String tenantId;
    @NotEmpty(message = "fullName cannot be null")
    @ApiModelProperty(required = true)
    private String fullName;
    @NotEmpty(message = "phone cannot be null")
    @ApiModelProperty(required = true)
    private String phone;
    @NotEmpty(message = "serviceName cant not be null")
    @ApiModelProperty(name = "serviceName", required = true)
    private String serviceName;
    @ApiModelProperty(name = "logoPath")
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
