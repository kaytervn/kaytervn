package com.base.auth.form.user;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
@ApiModel
public class SignUpUserForm {

    @ApiModelProperty(name = "email")
    @Email
    private String email;
    @NotEmpty(message = "phone cant not be null")
    @ApiModelProperty(name = "phone",required = true)
    private String phone;
    @NotEmpty(message = "password cant not be null")
    @ApiModelProperty(name = "password", required = true)
    private String password;
    @NotEmpty(message = "fullName cant not be null")
    @ApiModelProperty(name = "fullName",example = "Tam Nguyen",required = true)
    private String fullName;
    private String avatarPath;
    @ApiModelProperty(name = "birthday")
    private Date birthday;

}
