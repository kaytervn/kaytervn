package com.finance.data.model.api.request.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class MessageSendRequest {
    Long chatRoomId;
    String content;
    String document;

    public MessageSendRequest(){

    }
    public MessageSendRequest(Long chatRoomId, String document) {
        this.chatRoomId = chatRoomId;
        this.document = document;
    }
    public MessageSendRequest(Long chatRoomId, String content, String document) {
        this.chatRoomId = chatRoomId;
        this.content = content;
        this.document = document;
    }
}
