package com.master.form.dbConfig;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Data
@ApiModel
public class CreateDbConfigForm {
    @NotNull(message = "maxConnection cannot be null")
    @Min(value = 1, message = "maxConnection must be greater than or equal to 1")
    @ApiModelProperty(name = "maxConnection", required = true)
    private Integer maxConnection;
    @ApiModelProperty(name = "initialize")
    private Boolean initialize;
    @NotNull(message = "serverProviderId cannot be null")
    @ApiModelProperty(name = "serverProviderId", required = true)
    private Long serverProviderId;
    @NotNull(message = "locationId cannot be null")
    @ApiModelProperty(name = "locationId", required = true)
    private Long locationId;
}
