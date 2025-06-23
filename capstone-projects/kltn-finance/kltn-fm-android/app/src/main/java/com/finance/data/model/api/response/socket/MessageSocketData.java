package com.finance.data.model.api.response.socket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageSocketData {
    private Long chatRoomId;
    private Long messageId;
    private String tenantName;
}
