package com.tenant.dto.chatroom.settings;

import lombok.Data;

@Data
public class MemberPermissionDto {
    private Boolean allow_send_messages;
    private Boolean allow_update_chat_room;
    private Boolean allow_invite_members;
}
