package com.master.form.customer;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Size;

@Data
public class UpdateCustomerProfileForm {
    @Size(min = 6, message = "oldPassword must be at least 6 characters")
    @ApiModelProperty(name = "oldPassword")
    private String oldPassword;
    @Size(min = 6, message = "newPassword must be at least 6 characters")
    @ApiModelProperty(name = "newPassword")
    private String newPassword;
    @ApiModelProperty(name = "fullName")
    private String fullName;
    @ApiModelProperty(name = "avatarPath")
    private String avatarPath;
}
