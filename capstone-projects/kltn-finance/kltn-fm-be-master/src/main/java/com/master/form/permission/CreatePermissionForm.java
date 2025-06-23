package com.master.form.permission;

import com.master.validation.PermissionKind;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@ApiModel
public class CreatePermissionForm {
    @NotBlank(message = "name cannot be null")
    @ApiModelProperty(name = "name", required = true)
    private String name;
    @NotBlank(message = "action cannot be null")
    @ApiModelProperty(name = "action", required = true)
    private String action;
    @NotNull(message = "showMenu cannot be null")
    @ApiModelProperty(name = "showMenu", required = true)
    private Boolean showMenu;
    @NotBlank(message = "description cannot be null")
    @ApiModelProperty(name = "description", required = true)
    private String description;
    @NotBlank(message = "nameGroup cannot be null")
    @ApiModelProperty(name = "nameGroup", required = true)
    private String nameGroup;
    @NotBlank(message = "permissionCode cannot be null")
    @ApiModelProperty(name = "permissionCode", required = true)
    private String permissionCode;
    @PermissionKind
    @ApiModelProperty(required = true)
    private Integer kind;
}
