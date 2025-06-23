package com.tenant.form.chatHistory;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CreateChatHistoryForm {
    @ApiModelProperty(required = true)
    @NotBlank(message = "message cannot be blank")
    private String message;
}
