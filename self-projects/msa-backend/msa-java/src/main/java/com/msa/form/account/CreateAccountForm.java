package com.msa.form.account;

import com.msa.validation.AccountKind;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class CreateAccountForm {
    @AccountKind
    @ApiModelProperty(required = true)
    private Integer kind;
    private String username;
    private String password;
    private String note;
    @NotNull(message = "platformId cannot be null")
    @ApiModelProperty(required = true)
    private Long platformId;
    private Long parentId;
    private Long tagId;
    private String codes;
}