package com.master.form.account;

import com.master.validation.PasswordConstraint;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@ApiModel
public class ChangeProfilePasswordAccountForm {
    @NotBlank(message = "password cannot be null")
    @Size(min = 6, message = "password must be 6 characters")
    @PasswordConstraint
    @ApiModelProperty(name = "password", required = true)
    private String oldPassword;
    @NotBlank(message = "newPassword cannot be null")
    @Size(min = 6, message = "newPassword must be 6 characters")
    @PasswordConstraint
    @ApiModelProperty(name = "newPassword", required = true)
    private String newPassword;
}
