package com.msa.form.bank;

import com.msa.constant.AppConstant;
import com.msa.validation.ValidJsonField;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class CreateBankForm {
    @NotBlank(message = "username cannot be blank")
    @ApiModelProperty(required = true)
    private String username;
    @NotBlank(message = "password cannot be blank")
    @ApiModelProperty(required = true)
    private String password;
    @ValidJsonField(classType = List.class, type = AppConstant.JSON_TYPE_LIST_OBJECT, allowNull = true)
    @ApiModelProperty(required = true)
    private String numbers;
    @NotBlank(message = "pins cannot be blank")
    @ApiModelProperty(required = true)
    private String pins;
    @NotNull(message = "tagId cannot be null")
    @ApiModelProperty(required = true)
    private Long tagId;
}
