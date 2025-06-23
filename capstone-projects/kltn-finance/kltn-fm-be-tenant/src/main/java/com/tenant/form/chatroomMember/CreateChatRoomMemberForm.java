package com.tenant.form.chatroomMember;

import lombok.Data;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.*;
import java.util.*;
@Data
public class CreateChatRoomMemberForm {
    @NotNull(message = "chatRoomId cannot be null")
    @ApiModelProperty(required = true)
    private Long chatRoomId;
    @NotEmpty(message = "memberIds cannot be empty")
    @ApiModelProperty(required = true)
    private List<Long> memberIds;
}