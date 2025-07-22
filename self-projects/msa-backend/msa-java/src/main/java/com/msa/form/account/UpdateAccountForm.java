package com.msa.form.account;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class UpdateAccountForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(required = true)
    private Long id;
    private String username;
    private String password;
    private String note;
    @NotNull(message = "platformId cannot be null")
    @ApiModelProperty(required = true)
    private Long platformId;
}
