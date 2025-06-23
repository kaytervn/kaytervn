package com.master.form.serverProvider;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@ApiModel
public class UpdateServerProviderForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(name = "id", required = true)
    private Long id;
    @NotBlank(message = "name cannot be null")
    @ApiModelProperty(name = "name", required = true)
    private String name;
    @NotBlank(message = "url cannot be null")
    @ApiModelProperty(name = "url", required = true)
    private String url;
    @NotNull(message = "maxTenant cannot be null")
    @Min(value = 1, message = "maxTenant must be greater than or equal to 1")
    @ApiModelProperty(name = "maxTenant", required = true)
    private Integer maxTenant;
}
