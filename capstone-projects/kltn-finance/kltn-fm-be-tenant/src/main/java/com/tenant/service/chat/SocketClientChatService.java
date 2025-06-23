package com.tenant.service.chat;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tenant.constant.FinanceConstant;
import com.tenant.multitenancy.tenant.TenantDBContext;
import com.tenant.rabbit.form.BaseSendMsgForm;
import com.tenant.rabbit.form.ProcessTenantForm;
import com.tenant.socket.MyWebSocketClient;
import com.tenant.storage.tenant.repository.ChatRoomMemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class SocketClientChatService {
    @Autowired
    private MyWebSocketClient socketClient;
    @Autowired
    private ChatRoomMemberRepository chatRoomMemberRepository;
    @Autowired
    private ObjectMapper objectMapper;

    public <T> void handleSendMsg(ProcessTenantForm<T> processTenantForm) {
        BaseSendMsgForm<T> form = new BaseSendMsgForm<>();
        form.setApp(processTenantForm.getAppName());
        form.setCmd(processTenantForm.getCmd());
        form.setData(processTenantForm.getData());
        form.setToken(processTenantForm.getToken());
        String msg;
        try {
            msg = objectMapper.writeValueAsString(form);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        socketClient.send(msg);
    }

    private void notifyChatRoomMembers(Long chatRoomId, Long messageId, String command) {
        if (chatRoomId == null || command == null) {
            return;
        }

        List<Long> memberIds = chatRoomMemberRepository.findAllMemberIdsByChatRoomId(chatRoomId);
        if (memberIds == null || memberIds.isEmpty()) {
            return;
        }

        String tenantName = TenantDBContext.getCurrentTenant();

        SendMessageRequest request = new SendMessageRequest();
        request.setTenantName(tenantName);
        request.setChatRoomId(chatRoomId);
        request.setMemberIds(memberIds);
        if (messageId != null) {
            request.setMessageId(messageId);
        }

        ProcessTenantForm<SendMessageRequest> form = new ProcessTenantForm<>();
        form.setAppName(FinanceConstant.BACKEND_APP);
        form.setCmd(command);
        form.setData(request);

        handleSendMsg(form);
    }

    private void notifyChatRoomMembers(Long chatRoomId, Long messageId, String command, List<Long> memberIds) {
        if (chatRoomId == null || command == null || memberIds == null || memberIds.isEmpty()) {
            return;
        }
        String tenantName = TenantDBContext.getCurrentTenant();
        SendMessageRequest request = new SendMessageRequest();
        request.setTenantName(tenantName);
        request.setChatRoomId(chatRoomId);
        request.setMemberIds(memberIds);
        if (messageId != null) {
            request.setMessageId(messageId);
        }
        ProcessTenantForm<SendMessageRequest> form = new ProcessTenantForm<>();
        form.setAppName(FinanceConstant.BACKEND_APP);
        form.setCmd(command);
        form.setData(request);
        handleSendMsg(form);
    }

    public void sendMessageToChatRoomId(Long chatRoomId, Long messageId) {
        notifyChatRoomMembers(chatRoomId, messageId, FinanceConstant.CMD_NEW_MESSAGE);
    }

    public void sendMsgChatRoomCreated(Long chatRoomId) {
        notifyChatRoomMembers(chatRoomId, null, FinanceConstant.CMD_CHAT_ROOM_CREATED);
    }

    public void sendMsgChatRoomUpdated(Long chatRoomId) {
        notifyChatRoomMembers(chatRoomId, null, FinanceConstant.CMD_CHAT_ROOM_UPDATED);
    }

    public void sendMsgChatRoomDeleted(Long chatRoomId) {
        notifyChatRoomMembers(chatRoomId, null, FinanceConstant.CMD_CHAT_ROOM_DELETED);
    }

    public void broadcastMessageUpdated(Long chatRoomId, Long messageId) {
        notifyChatRoomMembers(chatRoomId, messageId, FinanceConstant.CMD_MESSAGE_UPDATED);
    }

    public void sendMsgChatRoomCreated(Long chatRoomId, List<Long> memberIds) {
        notifyChatRoomMembers(chatRoomId, null, FinanceConstant.CMD_CHAT_ROOM_CREATED, memberIds);
    }

    public void sendMsgChatRoomUpdated(Long chatRoomId, List<Long> memberIds) {
        notifyChatRoomMembers(chatRoomId, null, FinanceConstant.CMD_CHAT_ROOM_UPDATED, memberIds);
    }

    public void sendMsgChatRoomDeleted(Long chatRoomId, List<Long> memberIds) {
        notifyChatRoomMembers(chatRoomId, null, FinanceConstant.CMD_CHAT_ROOM_DELETED, memberIds);
    }
}
