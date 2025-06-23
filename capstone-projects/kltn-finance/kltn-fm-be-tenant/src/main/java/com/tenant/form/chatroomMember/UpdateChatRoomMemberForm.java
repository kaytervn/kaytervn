package com.tenant.form.chatroomMember;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import javax.validation.constraints.*;

@Data
public class UpdateChatRoomMemberForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(required = true)
    private Long id;
    @NotBlank(message = "lastReadMessageId cannot be blank")
    @ApiModelProperty(required = true)
    private Long lastReadMessageId;
}