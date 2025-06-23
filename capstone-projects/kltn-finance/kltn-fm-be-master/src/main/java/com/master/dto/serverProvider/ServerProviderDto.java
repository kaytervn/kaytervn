package com.master.dto.serverProvider;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ServerProviderDto {
    @ApiModelProperty(name = "id")
    private Long id;
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "url")
    private String url;
    @ApiModelProperty(name = "maxTenant")
    private Integer maxTenant;
    @ApiModelProperty(name = "currentTenantCount")
    private Integer currentTenantCount;
    @ApiModelProperty(name = "mySqlJdbcUrl")
    private String mySqlJdbcUrl;
    @ApiModelProperty(name = "mySqlRootUser")
    private String mySqlRootUser;
    @ApiModelProperty(name = "mySqlRootPassword")
    private String mySqlRootPassword;
    @ApiModelProperty(name = "driverClassName")
    private String driverClassName;
}
