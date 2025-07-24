package com.msa.form.schedule;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CheckScheduleForm {
    @NotBlank(message = "token cannot be blank")
    private String token;
}
