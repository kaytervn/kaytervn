package com.msa.socket;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.msa.cache.SessionService;
import com.msa.constant.SecurityConstant;
import com.msa.config.filter.dto.ResponseDto;
import com.msa.jwt.AppJwt;
import com.msa.service.encryption.EncryptionService;
import com.msa.socket.dto.ClientChannelDto;
import com.msa.socket.dto.LockDeviceRequest;
import com.msa.socket.dto.MessageDto;
import com.msa.utils.JSONUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

@Service
@Slf4j
public class SocketService {
    @Value("${app.signing-key}")
    private String signingKey;
    @Autowired
    private SessionService sessionService;
    @Autowired
    private SocketHandler socketHandler;
    @Autowired
    private EncryptionService encryptionService;

    public AppJwt getTokenAdditionalInfo(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(signingKey);
            JWTVerifier verifier = JWT.require(algorithm).acceptLeeway(1).acceptExpiresAt(5).build();
            DecodedJWT decodedJWT = verifier.verify(token);
            String additionalInfo = decodedJWT.getClaim("additional_info").asString();
            return AppJwt.decode(additionalInfo);
        } catch (Exception e) {
            return null;
        }
    }

    public void sendResponseMsg(WebSocketSession session, MessageDto oldRequest, String message, int responseCode) {
        try {
            MessageDto response = new MessageDto();
            response.setCmd(oldRequest.getCmd());
            response.setMsg(message);
            response.setResponseCode(responseCode);
            ResponseDto dto = new ResponseDto();
            dto.setResponse(encryptionService.clientEncryptInjectNonce(response.toJson()));
            session.sendMessage(new TextMessage(JSONUtils.convertObjectToJson(dto)));
        } catch (Exception e) {
            log.error("Failed to send WebSocket response: {}", e.getMessage(), e);
        }
    }


    public void sendSuccessMsg(WebSocketSession session, MessageDto oldRequest, String message) {
        sendResponseMsg(session, oldRequest, message, SecurityConstant.RESPONSE_CODE_SUCCESS);
    }

    public void sendErrorMsg(WebSocketSession session, MessageDto oldRequest, String message) {
        sendResponseMsg(session, oldRequest, message, SecurityConstant.RESPONSE_CODE_ERROR);
    }

    private boolean isValidSession(AppJwt jwt) {
        if (jwt == null) {
            return false;
        }
        String username = jwt.getUsername();
        Integer userKind = jwt.getUserKind();
        String sessionId = jwt.getSessionId();
        String key = sessionService.getKeyString(userKind, username);
        if (StringUtils.isNotBlank(key)) {
            return sessionService.isValidSession(key, sessionId);
        }
        return false;
    }

    public void handleClientPing(WebSocketSession session, MessageDto message) {
        AppJwt jwt = getTokenAdditionalInfo(message.getToken());
        if (isValidSession(jwt)) {
            handleCacheClientSession(session, jwt);
            sendSuccessMsg(session, message, "Ping success with user: " + jwt.getUsername());
        } else {
            sendErrorMsg(session, message, "Token invalid");
        }
    }

    private void handleCacheClientSession(WebSocketSession session, AppJwt jwt) {
        Long userId = jwt.getAccountId();
        Integer userKind = jwt.getUserKind();
        String username = jwt.getUsername();
        String clientChannelId = username + "&" + userKind;
        ClientChannelDto channel = socketHandler.getClientChannel(clientChannelId);
        if (channel != null) {
            channel.setTime(System.currentTimeMillis());
            channel.setSession(session);
        } else {
            ClientChannelDto clientChannel = new ClientChannelDto();
            clientChannel.setUserId(userId);
            clientChannel.setUserKind(userKind);
            clientChannel.setTime(System.currentTimeMillis());
            clientChannel.setSession(session);
            socketHandler.addClientChannel(clientChannelId, clientChannel);
        }
    }

    public void handleLockDevice(MessageDto message) {
        LockDeviceRequest request = message.getDataObject(LockDeviceRequest.class);
        ClientChannelDto clientChannel = socketHandler.getClientChannel(request.getChannelId());
        if (clientChannel != null) {
            sendErrorMsg(clientChannel.getSession(), message, "Lock account: " + request.getUsername());
        } else {
            log.error("Client channel is null");
        }
    }
}
