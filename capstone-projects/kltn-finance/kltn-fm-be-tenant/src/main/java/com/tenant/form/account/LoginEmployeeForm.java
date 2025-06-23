package com.tenant.form.account;

import com.tenant.validation.EmployeeGrantType;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

@Data
public class LoginEmployeeForm {
    @NotBlank(message = "username is required")
    @ApiModelProperty(required = true)
    private String username;
    @NotBlank(message = "password is required")
    @ApiModelProperty(required = true)
    private String password;
    @EmployeeGrantType
    @ApiModelProperty(required = true)
    private String grantType;
    @ApiModelProperty(hidden = true)
    private Long userId;
    @ApiModelProperty(hidden = true)
    private String tenantId;
    @ApiModelProperty(hidden = true)
    private List<Long> permissionIds = new ArrayList<>();
}
