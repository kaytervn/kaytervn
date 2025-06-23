package com.master.dto.serverProvider;

import com.master.dto.ABasicAdminDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ServerProviderAdminDto extends ABasicAdminDto {
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
