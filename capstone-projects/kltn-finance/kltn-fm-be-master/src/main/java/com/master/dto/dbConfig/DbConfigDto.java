package com.master.dto.dbConfig;

import com.master.dto.serverProvider.ServerProviderDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class DbConfigDto {
    @ApiModelProperty(name = "id")
    private Long id;
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
}
