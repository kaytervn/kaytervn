package com.msa.socket.dto;

import lombok.Data;
import org.springframework.web.socket.WebSocketSession;

@Data
public class ClientChannelDto {
    private Long userId;
    private Integer userKind;
    private Long time;
    private WebSocketSession session;
}
