package com.tenant.form.faceId;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class RequestFaceIdForm {
    @NotBlank(message = "imageData cannot be blank")
    @ApiModelProperty(value = "Base64 encoded image data", required = true)
    private String imageData;
}
