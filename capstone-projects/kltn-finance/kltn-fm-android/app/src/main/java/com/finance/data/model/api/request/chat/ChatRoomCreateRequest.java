package com.finance.data.model.api.request.chat;

import com.finance.data.model.api.response.chat.AccountChatResponse;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomCreateRequest {
    private Long accountId;
    private Boolean allow_invite_members = true;
    private Boolean allow_send_message = true;
    private Boolean allow_update_chat_room = true;
    private String avatar = "";
    private Integer kind = 2;
    private List<Long> memberIds = new ArrayList<>();
    private String name = "";
}
