package com.tenant.form.account;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class RequestLoginQrCodeForm {
    @NotBlank(message = "clientId cant not be null")
    @ApiModelProperty(required = true)
    private String clientId;
}
