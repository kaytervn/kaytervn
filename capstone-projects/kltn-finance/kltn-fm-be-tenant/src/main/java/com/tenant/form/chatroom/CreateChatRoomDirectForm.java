package com.tenant.form.chatroom;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class CreateChatRoomDirectForm {
    @ApiModelProperty(required = true)
    @NotNull(message = "accountId")
    private Long accountId;
}
