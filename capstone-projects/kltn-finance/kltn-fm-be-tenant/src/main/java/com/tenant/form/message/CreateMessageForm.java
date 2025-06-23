package com.tenant.form.message;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class CreateMessageForm {
    @NotNull(message = "chatroomId cannot be null")
    @ApiModelProperty(required = true)
    private Long chatRoomId;
    private String content;
    private String document;
    private Long parentMessageId;
}