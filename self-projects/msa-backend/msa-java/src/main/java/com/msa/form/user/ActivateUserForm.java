package com.msa.form.user;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ActivateUserForm {
    @NotBlank(message = "password cannot be blank")
    private String password;
    @NotBlank(message = "token cannot be blank")
    private String token;
}
