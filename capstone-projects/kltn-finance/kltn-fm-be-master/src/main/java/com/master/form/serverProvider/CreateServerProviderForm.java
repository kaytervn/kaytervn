package com.master.form.serverProvider;

import com.master.validation.HostConstraint;
import com.master.validation.PortConstraint;
import com.master.validation.UsernameConstraint;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@ApiModel
public class CreateServerProviderForm {
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
    @NotBlank(message = "host cannot be null")
    @ApiModelProperty(name = "host", required = true)
    @HostConstraint
    private String host;
    @NotBlank(message = "port cannot be null")
    @ApiModelProperty(name = "port", required = true)
    @PortConstraint
    private String port;
    @NotBlank(message = "mySqlRootUser cannot be null")
    @UsernameConstraint
    @ApiModelProperty(name = "mySqlRootUser", required = true)
    private String mySqlRootUser;
    @NotBlank(message = "mySqlRootPassword cannot be null")
    @ApiModelProperty(name = "mySqlRootPassword", required = true)
    private String mySqlRootPassword;
}
