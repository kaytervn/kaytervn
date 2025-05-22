package com.base.auth.form.service;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
@ApiModel
public class UpdateServiceByCustomerForm {
    @NotNull(message = "id cant not be null")
    @ApiModelProperty(name = "id", required = true)
    private Long  id;
    @NotEmpty(message = "serviceName cant not be null")
    @ApiModelProperty(name = "serviceName", required = true)
    private String serviceName;
    @ApiModelProperty(name = "address")
    private String address;
    @ApiModelProperty(name = "logoPath")
    private String logoPath;
    @ApiModelProperty(name = "bannerPath")
    private String bannerPath;
    @ApiModelProperty(name = "hotline")
    private String hotline;
    @ApiModelProperty(name = "settings")
    private String settings="{}";

    @ApiModelProperty(name = "latitude", required = false)
    private Double latitude;

    @ApiModelProperty(name = "longitude", required = false)
    private Double longitude;
}
