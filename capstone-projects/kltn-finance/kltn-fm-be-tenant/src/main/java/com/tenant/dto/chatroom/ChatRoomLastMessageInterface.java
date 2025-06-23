package com.tenant.dto.chatroom;

import com.tenant.storage.tenant.model.*;

public interface ChatRoomLastMessageInterface {
    Long getChatRoomId();

    Message getLastMessage();
}