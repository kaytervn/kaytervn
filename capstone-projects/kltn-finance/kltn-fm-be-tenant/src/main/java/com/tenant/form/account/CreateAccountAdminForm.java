package com.tenant.form.account;

import com.tenant.validation.*;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.*;
import java.util.Date;

@Data
@ApiModel
public class CreateAccountAdminForm {
    @NotBlank(message = "username cannot be null")
    @Size(min = 2, max = 20, message = "username must be between 2 and 20 characters")
    @UsernameConstraint
    @ApiModelProperty(name = "username", required = true)
    private String username;
    @NotBlank(message = "password cannot be null")
    @Size(min = 6, message = "password must be 6 characters")
    @PasswordConstraint
    @ApiModelProperty(name = "password", required = true)
    private String password;
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
    @ApiModelProperty(name = "birthDate")
    private Date birthDate;
    @ApiModelProperty(name = "address")
    private String address;
    @NotNull(message = "status cannot be null")
    @ApiModelProperty(name = "status", required = true)
    @StatusConstraint
    private Integer status;
    @NotNull(message = "groupId cannot be null")
    @ApiModelProperty(name = "groupId", required = true)
    private Long groupId;
    @NotNull(message = "departmentId cannot be null")
    @ApiModelProperty(name = "departmentId", required = true)
    private Long departmentId;
}
