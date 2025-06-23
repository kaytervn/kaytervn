package com.master.form.account;

import com.master.validation.*;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@ApiModel
public class UpdateAccountAdminForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(name = "id", required = true)
    private Long id;
    @NameConstraint
    @NotBlank(message = "fullName cannot be null")
    @ApiModelProperty(name = "fullName", required = true)
    private String fullName;
    @ApiModelProperty(name = "avatarPath")
    private String avatarPath;
    @NotBlank(message = "email cannot be null")
    @EmailConstraint
    @ApiModelProperty(name = "email", required = true)
    private String email;
    @NotBlank(message = "phone cannot be null")
    @PhoneConstraint
    @ApiModelProperty(name = "phone", required = true)
    private String phone;
    @NotNull(message = "status cannot be null")
    @StatusConstraint
    @ApiModelProperty(name = "status", required = true)
    private Integer status;
    @NotNull(message = "groupId cannot be null")
    @ApiModelProperty(required = true)
    private Long groupId;
    @Size(min = 6, message = "password must be 6 characters")
    @PasswordConstraint(allowNull = true)
    private String password;
}
