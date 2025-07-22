package com.msa.form.dbCofig;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class CreateDbConfigForm {
    @NotBlank(message = "name cannot be blank")
    @ApiModelProperty(required = true)
    private String name;
    @NotNull(message = "maxConnection cannot be null")
    @Min(value = 1, message = "maxConnection must be greater than or equal to 1")
    @ApiModelProperty(name = "maxConnection", required = true)
    private Integer maxConnection;
    @NotNull(message = "serverProviderId cannot be null")
    @ApiModelProperty(name = "serverProviderId", required = true)
    private Long serverProviderId;
    @NotNull(message = "userId cannot be null")
    @ApiModelProperty(name = "userId", required = true)
    private Long userId;
}
