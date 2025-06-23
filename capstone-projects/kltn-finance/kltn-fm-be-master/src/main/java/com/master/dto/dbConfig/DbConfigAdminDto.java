package com.master.dto.dbConfig;

import com.master.dto.ABasicAdminDto;
import com.master.dto.location.LocationDto;
import com.master.dto.serverProvider.ServerProviderDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class DbConfigAdminDto extends ABasicAdminDto {
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "url")
    private String url;
    @ApiModelProperty(name = "username")
    private String username;
    @ApiModelProperty(name = "password")
    private String password;
    @ApiModelProperty(name = "maxConnection")
    private Integer maxConnection;
    @ApiModelProperty(name = "driverClassName")
    private String driverClassName;
    @ApiModelProperty(name = "initialize")
    private Boolean initialize;
    @ApiModelProperty(name = "serverProvider")
    private ServerProviderDto serverProvider;
    private LocationDto location;
}
