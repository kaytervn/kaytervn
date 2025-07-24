package com.msa.form.user;

import com.msa.validation.*;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class CreateUserForm {
    @PatternConstraint
    @ApiModelProperty(required = true)
    private String username;
    @NotBlank(message = "password cannot be blank")
    @Size(min = 6, message = "password must be at least 6 characters long")
    @ApiModelProperty(required = true)
    private String password;
    @NotBlank(message = "fullName cannot be blank")
    @ApiModelProperty(required = true)
    private String fullName;
    @UrlConstraint
    private String avatarPath;
    @EmailConstraint
    @ApiModelProperty(required = true)
    private String email;
    @NotNull(message = "groupId cannot be null")
    @ApiModelProperty(required = true)
    private Long groupId;
}
