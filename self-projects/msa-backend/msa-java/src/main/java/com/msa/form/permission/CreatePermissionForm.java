package com.msa.form.permission;

import com.msa.validation.UserKind;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CreatePermissionForm {
    @NotBlank(message = "name cannot be blank")
    @ApiModelProperty(required = true)
    private String name;
    @NotBlank(message = "nameGroup cannot be blank")
    @ApiModelProperty(required = true)
    private String nameGroup;
    @NotBlank(message = "permissionCode cannot be blank")
    @ApiModelProperty(required = true)
    private String permissionCode;
    @UserKind
    @ApiModelProperty(required = true)
    private Integer kind;
}