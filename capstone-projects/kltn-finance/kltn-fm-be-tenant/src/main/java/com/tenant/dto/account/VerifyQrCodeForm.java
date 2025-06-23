package com.tenant.dto.account;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class VerifyQrCodeForm {
    @NotBlank(message = "qrCode cannot be blank")
    @ApiModelProperty(required = true)
    private String qrCode;
}
