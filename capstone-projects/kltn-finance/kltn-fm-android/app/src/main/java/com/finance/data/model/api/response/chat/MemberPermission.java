package com.finance.data.model.api.response.chat;

import com.google.gson.annotations.SerializedName;

import lombok.Data;

@Data
public class MemberPermission {
    @SerializedName("allow_send_messages")
    private boolean allowSendMessage = true;
    @SerializedName("allow_update_chat_room")
    private boolean allowUpdateChatRoom = true;
    @SerializedName("allow_invite_members")
    private boolean allowInviteMembers = true;
}
