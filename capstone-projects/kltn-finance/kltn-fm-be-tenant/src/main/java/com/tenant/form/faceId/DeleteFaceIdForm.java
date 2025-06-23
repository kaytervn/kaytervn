package com.tenant.form.faceId;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class DeleteFaceIdForm {
    @NotBlank(message = "password cannot be blank")
    @ApiModelProperty(required = true)
    private String password;
}
