package com.msa.form.user;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class ResetMfaForm {
    @NotNull(message = "id cannot be null")
    private Long id;
}
