package com.msa.form.json;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class BasicObject {
    @NotBlank(message = "name cannot be blank")
    private String name;
    private String note;
}