package com.master.dto.account;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class AccountForgetPasswordDto {
    @ApiModelProperty(name = "userId")
    private String userId;
}
