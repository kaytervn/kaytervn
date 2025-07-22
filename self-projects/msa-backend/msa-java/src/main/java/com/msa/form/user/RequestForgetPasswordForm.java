package com.msa.form.user;

import com.msa.validation.EmailConstraint;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class RequestForgetPasswordForm {
    @EmailConstraint
    @NotBlank(message = "Email cannot be null")
    @ApiModelProperty(required = true)
    private String email;
}
