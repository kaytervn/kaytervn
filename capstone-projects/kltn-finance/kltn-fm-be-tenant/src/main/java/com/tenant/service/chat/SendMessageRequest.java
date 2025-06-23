package com.tenant.service.chat;

import lombok.Data;

import java.util.List;

@Data
public class SendMessageRequest {
    private Long chatRoomId;
    private String tenantName;
    private Long messageId;
    private List<Long> memberIds;
}
