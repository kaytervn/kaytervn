package com.tenant.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tenant.dto.chatroom.settings.MemberPermissionDto;
import com.tenant.dto.chatroom.settings.SettingJsonFormat;
import com.tenant.storage.tenant.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class MessageService {
    @Autowired
    private MessageReactionRepository messageReactionRepository;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private ChatRoomMemberRepository chatRoomMemberRepository;
    @Autowired
    private ChatRoomRepository chatroomRepository;
    @Autowired
    private ObjectMapper objectMapper;

    public void deleteDataOfChatRoom(Long chatroomId){
        messageReactionRepository.deleteAllByMessageChatRoomId(chatroomId);
        chatRoomMemberRepository.deleteAllByChatRoomId(chatroomId);
        messageRepository.deleteAllByChatRoomId(chatroomId);
        chatroomRepository.deleteById(chatroomId);
    }

    public void deleteDataOfMemberOfChatRoom(Long chatroomId, Long memberId){
        chatRoomMemberRepository.deleteByChatRoomIdAndMemberId(chatroomId,memberId);
    }

    public SettingJsonFormat getSettingOfChatRoom(String settingString) {
        try {
            return objectMapper.readValue(settingString, SettingJsonFormat.class);
        } catch (Exception e) {
            MemberPermissionDto dto = new MemberPermissionDto();
            dto.setAllow_update_chat_room(true);
            dto.setAllow_send_messages(true);
            dto.setAllow_update_chat_room(true);
            SettingJsonFormat defaultSetting = new SettingJsonFormat();
            defaultSetting.setMember_permissions(dto);
            return defaultSetting;
        }
    }
}
