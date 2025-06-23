package com.tenant.dto.permission;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class PermissionDto {
    @ApiModelProperty(name = "id")
    private Long id;
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "action")
    private String action;
    @ApiModelProperty(name = "nameGroup")
    private String nameGroup;
    @ApiModelProperty(name = "permissionCode")
    private String permissionCode;
    @ApiModelProperty(name = "isSystem")
    private Boolean isSystem;
}
