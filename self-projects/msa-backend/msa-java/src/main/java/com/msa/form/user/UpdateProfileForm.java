package com.msa.form.user;

import com.msa.validation.UrlConstraint;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class UpdateProfileForm {
    @NotBlank(message = "fullName cannot be blank")
    @ApiModelProperty(required = true)
    private String fullName;
    @UrlConstraint
    private String avatarPath;
    @NotBlank(message = "oldPassword cannot be null")
    @ApiModelProperty(name = "oldPassword", required = true)
    private String oldPassword;
}
