package com.msa.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.msa.constant.AppConstant;
import com.msa.config.filter.dto.RequestDto;
import com.msa.service.encryption.EncryptionService;
import com.msa.socket.dto.ClientChannelDto;
import com.msa.socket.dto.MessageDto;
import lombok.Getter;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Getter
@Component
@Slf4j
public class SocketHandler extends TextWebSocketHandler {
    private final Map<String, ClientChannelDto> Channels = new ConcurrentHashMap<>();
    private final int SESSION_TIMEOUT = 2 * 60 * 1000; // 2 minutes
    @Autowired
    private SocketService socketService;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private EncryptionService encryptionService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("Socket connected: {}", session.getId());
    }

    private String getPayloadMsg(String rawMsg) {
        try {
            RequestDto requestDto = objectMapper.readValue(rawMsg, RequestDto.class);
            return encryptionService.clientDecryptIgnoreNonce(requestDto.getRequest());
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    protected void handleTextMessage(@NonNull WebSocketSession session, TextMessage message) {
        MessageDto messageDto = MessageDto.fromJson(getPayloadMsg(message.getPayload()), MessageDto.class);
        if (messageDto != null) {
            if (messageDto.getToken() == null) {
                socketService.sendErrorMsg(session, messageDto, "Full authentication is required to access this resource");
            } else {
                if (AppConstant.CMD_CLIENT_PING.equals(messageDto.getCmd())) {
                    socketService.handleClientPing(session, messageDto);
                } else {
                    socketService.sendErrorMsg(session, messageDto, "Unsupported command: " + messageDto.getCmd());
                }
            }
        } else {
            log.error("Error while handling text message: {}", message.getPayload());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, @NonNull CloseStatus status) {
        log.info("Socket disconnected: {}", session.getId());
    }

    public ClientChannelDto getClientChannel(String channelId) {
        return Channels.get(channelId);
    }

    public void addClientChannel(String channelId, ClientChannelDto clientChannel) {
        Channels.put(channelId, clientChannel);
    }

    public void removeClientChannel(String channelId) {
        Channels.remove(channelId);
    }

    public void scanAndRemoveChannel() {
        Iterator<String> keys = Channels.keySet().stream().iterator();
        while (keys.hasNext()) {
            String key = keys.next();
            ClientChannelDto value = getClientChannel(key);
            if (System.currentTimeMillis() - value.getTime() > SESSION_TIMEOUT) {
                removeClientChannel(key);
            } else {
                log.debug("Key exists: {}", key);
            }
        }
    }
}

