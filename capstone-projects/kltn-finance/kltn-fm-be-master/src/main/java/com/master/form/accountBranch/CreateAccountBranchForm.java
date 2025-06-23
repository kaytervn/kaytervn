package com.master.form.accountBranch;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class CreateAccountBranchForm {
    @NotNull(message = "branchId cannot be null")
    @ApiModelProperty(required = true)
    private Long branchId;
    @NotNull(message = "accountId cannot be null")
    @ApiModelProperty(required = true)
    private Long accountId;
}