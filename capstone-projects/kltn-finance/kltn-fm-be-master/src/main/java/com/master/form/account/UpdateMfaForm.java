package com.master.form.account;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class UpdateMfaForm {
    @NotNull(message = "id cannot be null!!!")
    private Long id;
}
