package com.msa.form.backupCode;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class CreateBackupCodeForm {
    @NotBlank(message = "code cannot be blank")
    @ApiModelProperty(required = true)
    private String code;
    @NotNull(message = "accountId cannot be null")
    @ApiModelProperty(required = true)
    private Long accountId;
}