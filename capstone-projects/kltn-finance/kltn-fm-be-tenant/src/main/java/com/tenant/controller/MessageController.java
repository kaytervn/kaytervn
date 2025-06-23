package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.message.MessageDto;
import com.tenant.exception.BadRequestException;
import com.tenant.form.message.CreateMessageForm;
import com.tenant.form.message.UpdateMessageForm;
import com.tenant.mapper.AccountMapper;
import com.tenant.mapper.MessageMapper;
import com.tenant.service.DocumentService;
import com.tenant.service.KeyService;
import com.tenant.service.MessageService;
import com.tenant.service.chat.SocketClientChatService;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.model.criteria.MessageCriteria;
import com.tenant.storage.tenant.repository.*;
import com.tenant.utils.AESUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/v1/message")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class MessageController extends ABasicController {
    @Autowired
    private ChatRoomMemberRepository chatRoomMemberRepository;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private MessageMapper messageMapper;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private ChatRoomRepository chatroomRepository;
    @Autowired
    private KeyService keyService;
    @Autowired
    private SocketClientChatService chatService;
    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private MessageService messageService;
    @Autowired
    private DocumentService documentService;

    private MessageDto getFormattedMessageDto(Message message) {
        Long currentId = getCurrentUser();
        List<MessageReaction> messageReactions = message.getMessageReactions();
        List<ChatRoomMember> seenMembers = message.getSeenMembers().stream().filter(seenMember -> !seenMember.getMember().getId().equals(message.getSender().getId())).collect(Collectors.toList());
        List<Account> seenAccounts = seenMembers.stream().map(ChatRoomMember::getMember).collect(Collectors.toList());
        MessageDto dto = messageMapper.fromEntityToMessageDto(message, keyService.getFinanceKeyWrapper());
        dto.setIsSender(Objects.equals(message.getSender().getId(), currentId));
        dto.setIsChildren(message.getParent() != null);
        dto.setTotalReactions((long) messageReactions.size());
        messageReactions.stream().filter(r -> Objects.equals(r.getAccount().getId(), currentId)).findFirst().ifPresent(r -> dto.setMyReaction(r.getKind()));
        dto.setIsReacted(!messageReactions.isEmpty());
        dto.setTotalSeenMembers((long) seenMembers.size());
        dto.setSeenMembers(accountMapper.fromEntityListToAccountDtoListAutoComplete(seenAccounts));
        return dto;
    }

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<MessageDto> get(@PathVariable("id") Long id) {
        Message message = messageRepository.findById(id).orElse(null);
        if (message == null) {
            throw new BadRequestException(ErrorCode.MESSAGE_ERROR_NOT_FOUND, "Not found message");
        }
        Long currentId = getCurrentUser();
        ChatRoom chatRoom = message.getChatRoom();
        ChatRoomMember chatRoomMember = chatRoomMemberRepository.findFirstByChatRoomIdAndMemberId(chatRoom.getId(), currentId).orElse(null);
        if (chatRoomMember == null) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_MEMBER_ERROR_NO_JOIN, "Account no in this room");
        }
        MessageDto dto = getFormattedMessageDto(message);
        if (chatRoomMember.getLastReadMessage() == null || message.getCreatedDate().after(chatRoomMember.getLastReadMessage().getCreatedDate())) {
            chatRoomMember.setLastReadMessage(message);
            chatRoomMemberRepository.save(chatRoomMember);
            chatService.broadcastMessageUpdated(chatRoom.getId(), message.getId());
        }
        return makeSuccessResponse(dto, "Get message success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<MessageDto>>> list(MessageCriteria messageCriteria, Pageable pageable) {
        if (messageCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        if (messageCriteria.getChatRoomId() == null) {
            throw new BadRequestException("Required chatroomId");
        }
        ChatRoom chatRoom = chatroomRepository.findById(messageCriteria.getChatRoomId()).orElse(null);
        if (chatRoom == null) {
            throw new BadRequestException("Chat room not found");
        }
        Long currentId = getCurrentUser();
        ChatRoomMember chatRoomMember = chatRoomMemberRepository.findFirstByChatRoomIdAndMemberId(chatRoom.getId(), currentId).orElse(null);
        if (chatRoomMember == null) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_MEMBER_ERROR_NO_JOIN, "Account is not in this room");
        }
        Page<Message> listMessage = messageRepository.findAll(messageCriteria.getCriteria(), pageable);
        ResponseListDto<List<MessageDto>> responseListObj = new ResponseListDto<>();

        List<MessageDto> dtos = listMessage.getContent().stream().map(this::getFormattedMessageDto).collect(Collectors.toList());

        responseListObj.setContent(dtos);
        responseListObj.setTotalPages(listMessage.getTotalPages());
        responseListObj.setTotalElements(listMessage.getTotalElements());

        // Update last message for member
        Message lastMessage = messageRepository.findLastMessageByChatRoomId(chatRoom.getId()).orElse(null);
        if (lastMessage != null) {
            if (chatRoomMember.getLastReadMessage() == null || lastMessage.getCreatedDate().after(chatRoomMember.getLastReadMessage().getCreatedDate())) {
                chatRoomMember.setLastReadMessage(lastMessage);
                chatRoomMemberRepository.save(chatRoomMember);
                chatService.broadcastMessageUpdated(chatRoom.getId(), lastMessage.getId());
            }
        }
        return makeSuccessResponse(responseListObj, "Get list message success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<MessageDto> create(@Valid @RequestBody CreateMessageForm form, BindingResult bindingResult) {
        String content = AESUtils.decrypt(keyService.getUserSecretKey(), form.getContent(), FinanceConstant.AES_ZIP_ENABLE);
        String document = documentService.decryptDocumentString(keyService.getUserSecretKey(), form.getDocument());
        if (StringUtils.isBlank(content) && StringUtils.isBlank(document)) {
            throw new BadRequestException("Required content or document");
        }
        Message message = new Message();
        message.setContent(AESUtils.encrypt(keyService.getFinanceSecretKey(), content, FinanceConstant.AES_ZIP_ENABLE));
        message.setDocument(AESUtils.encrypt(keyService.getFinanceSecretKey(), document, FinanceConstant.AES_ZIP_ENABLE));
        Long currentId = getCurrentUser();
        Account sender = accountRepository.findById(currentId).orElse(null);
        if (sender == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found sender");
        }
        ChatRoom chatRoom = chatroomRepository.findById(form.getChatRoomId()).orElse(null);
        if (chatRoom == null) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_ERROR_NOT_FOUND, "Not found chatRoom");
        }
        boolean isMemberOfChatRoom = checkIsMemberOfChatRoom(currentId, chatRoom.getId());
        boolean isOwnerOfChatRoom = checkOwnerChatRoom(currentId, chatRoom.getId());
        boolean allowSendMessages = messageService.getSettingOfChatRoom(chatRoom.getSettings()).getMember_permissions().getAllow_send_messages();
        if (!isMemberOfChatRoom) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_MEMBER_ERROR_NO_JOIN, "Account no in this room");
        }
        if (FinanceConstant.CHATROOM_KIND_GROUP.equals(chatRoom.getKind()) && !isOwnerOfChatRoom && !allowSendMessages) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_MEMBER_ERROR_IS_NOT_SEND_MESSAGES, "Members unable to send message");
        }
        if (form.getParentMessageId() != null) {
            Message parent = messageRepository.findFirstByIdAndChatRoomId(form.getParentMessageId(), chatRoom.getId()).orElse(null);
            if (parent == null) {
                throw new BadRequestException(ErrorCode.MESSAGE_ERROR_NOT_FOUND, "Message parent can not found");
            }
            message.setParent(parent);
        }
        message.setSender(sender);
        message.setChatRoom(chatRoom);
        messageRepository.save(message);
        chatService.sendMessageToChatRoomId(chatRoom.getId(), message.getId());
        MessageDto dto = getFormattedMessageDto(message);
        return makeSuccessResponse(dto, "Create message success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateMessageForm form, BindingResult bindingResult) {
        String content = AESUtils.decrypt(keyService.getUserSecretKey(), form.getContent(), FinanceConstant.AES_ZIP_ENABLE);
        String document = documentService.decryptDocumentString(keyService.getUserSecretKey(), form.getDocument());
        if (StringUtils.isBlank(content) && StringUtils.isBlank(document)) {
            throw new BadRequestException("Required content or document");
        }
        Message message = messageRepository.findById(form.getId()).orElse(null);
        if (message == null) {
            throw new BadRequestException(ErrorCode.MESSAGE_ERROR_NOT_FOUND, "Not found message");
        }
        message.setContent(AESUtils.encrypt(keyService.getFinanceSecretKey(), content, FinanceConstant.AES_ZIP_ENABLE));
        message.setDocument(AESUtils.encrypt(keyService.getFinanceSecretKey(), document, FinanceConstant.AES_ZIP_ENABLE));
        Long currentId = getCurrentUser();
        ChatRoom chatroom = message.getChatRoom();
        boolean isMemberOfChatRoom = checkIsMemberOfChatRoom(currentId, message.getChatRoom().getId());
        if (!isMemberOfChatRoom) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_MEMBER_ERROR_NO_JOIN, "Account no in this room");
        }
        if (!Objects.equals(message.getSender().getId(), getCurrentUser())) {
            throw new BadRequestException(ErrorCode.MESSAGE_ERROR_NO_OWNER, "You are not the sender");
        }
        message.setIsUpdate(true);
        messageRepository.save(message);
        chatService.broadcastMessageUpdated(chatroom.getId(), message.getId());
        return makeSuccessResponse(null, "Update message success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Message message = messageRepository.findById(id).orElse(null);
        if (message == null) {
            throw new BadRequestException(ErrorCode.MESSAGE_ERROR_NOT_FOUND, "Not found message");
        }
        if (message.getIsDeleted()) {
            throw new BadRequestException(ErrorCode.MESSAGE_ERROR_DELETED, "Message already deleted");
        }
        if (!Objects.equals(message.getSender().getId(), getCurrentUser())) {
            throw new BadRequestException(ErrorCode.MESSAGE_ERROR_NO_OWNER, "You are not the sender");
        }
        Long currentId = getCurrentUser();
        ChatRoom chatroom = message.getChatRoom();
        boolean isMemberOfChatRoom = checkIsMemberOfChatRoom(currentId, message.getChatRoom().getId());
        if (!isMemberOfChatRoom) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_MEMBER_ERROR_NO_JOIN, "Account no in this room");
        }
        message.setContent(null);
        message.setDocument(null);
        message.setIsDeleted(true);
        messageRepository.save(message);
        chatService.broadcastMessageUpdated(chatroom.getId(), message.getId());
        return makeSuccessResponse(null, "Delete message success");
    }
}
