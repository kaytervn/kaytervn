package com.tenant.form.servicePermission;

import com.tenant.validation.PermissionKind;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class CreateServicePermissionForm {
    @NotNull(message = "permissionKind cannot be null")
    @PermissionKind
    @ApiModelProperty(name = "permissionKind", required = true)
    private Integer permissionKind;
    @NotNull(message = "accountId cannot be null")
    @ApiModelProperty(name = "accountId", required = true)
    private Long accountId;
    @ApiModelProperty(name = "serviceId")
    private Long serviceId;
    @ApiModelProperty(name = "serviceGroupId")
    private Long serviceGroupId;
}
