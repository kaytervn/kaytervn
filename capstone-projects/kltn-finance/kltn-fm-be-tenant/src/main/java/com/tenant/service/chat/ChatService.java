package com.tenant.service.chat;

import com.tenant.constant.FinanceConstant;
import com.tenant.multitenancy.tenant.TenantDBContext;
import com.tenant.rabbit.RabbitService;
import com.tenant.rabbit.form.ProcessTenantForm;
import com.tenant.storage.tenant.repository.ChatRoomMemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class ChatService {
    @Autowired
    private RabbitService rabbitService;
    @Value("${rabbitmq.queue.notification}")
    private String notificationQueue;
    @Autowired
    private ChatRoomMemberRepository chatRoomMemberRepository;

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
        form.setQueueName(notificationQueue);
        form.setCmd(command);
        form.setData(request);

        rabbitService.handleSendMsg(form);
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
        form.setQueueName(notificationQueue);
        form.setCmd(command);
        form.setData(request);
        rabbitService.handleSendMsg(form);
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
