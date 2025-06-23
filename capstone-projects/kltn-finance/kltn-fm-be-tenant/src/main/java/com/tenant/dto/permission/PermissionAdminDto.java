package com.tenant.dto.permission;

import io.swagger.annotations.ApiModelProperty;
import com.tenant.dto.ABasicAdminDto;
import lombok.Data;

@Data
public class PermissionAdminDto extends ABasicAdminDto{
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "action")
    private String action;
    @ApiModelProperty(name = "showMenu")
    private Boolean showMenu;
    @ApiModelProperty(name = "description")
    private String description;
    @ApiModelProperty(name = "nameGroup")
    private String nameGroup;
    @ApiModelProperty(name = "permissionCode")
    private String permissionCode;
    @ApiModelProperty(name = "isSystem")
    private Boolean isSystem;
}
