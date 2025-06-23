package com.master.form.account;

import com.master.validation.NameConstraint;
import com.master.validation.PasswordConstraint;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;

@Data
public class UpdateProfileAdminForm {
    @NotBlank(message = "oldPassword cannot be null")
    @Size(min = 6, message = "password must be 6 characters")
    @PasswordConstraint
    @ApiModelProperty(name = "oldPassword", required = true)
    private String oldPassword;
    @NameConstraint
    @NotBlank(message = "fullName cannot be null")
    @ApiModelProperty(name = "fullName", required = true)
    private String fullName;
    @ApiModelProperty(name = "avatarPath")
    private String avatarPath;
}
