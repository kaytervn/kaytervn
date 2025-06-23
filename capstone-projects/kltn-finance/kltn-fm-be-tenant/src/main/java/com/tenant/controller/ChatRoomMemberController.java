package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.service.MessageService;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.chatroomMember.ChatRoomMemberDto;
import com.tenant.exception.BadRequestException;
import com.tenant.form.chatroomMember.CreateChatRoomMemberForm;
import com.tenant.mapper.ChatRoomMemberMapper;
import com.tenant.service.chat.SocketClientChatService;
import com.tenant.storage.tenant.model.Account;
import com.tenant.storage.tenant.model.ChatRoom;
import com.tenant.storage.tenant.model.ChatRoomMember;
import com.tenant.storage.tenant.model.criteria.ChatRoomMemberCriteria;
import com.tenant.storage.tenant.repository.*;
import lombok.extern.slf4j.Slf4j;
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
@RequestMapping("/v1/chat-room-member")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatRoomMemberController extends ABasicController {
    @Autowired
    private ChatRoomMemberRepository chatRoomMemberRepository;
    @Autowired
    private ChatRoomMemberMapper chatRoomMemberMapper;
    @Autowired
    private ChatRoomRepository chatroomRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private MessageService messageService;
    @Autowired
    private SocketClientChatService chatService;

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<ChatRoomMemberDto>>> list(ChatRoomMemberCriteria chatRoomMemberCriteria, Pageable pageable) {
        if (chatRoomMemberCriteria.getChatRoomId() == null) {
            throw new BadRequestException("chatRoomId is required");
        }
        ChatRoom chatroom = chatroomRepository.findById(chatRoomMemberCriteria.getChatRoomId()).orElse(null);
        if (chatroom == null) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_ERROR_NOT_FOUND, "Not found room");
        }
        if (chatRoomMemberCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        Page<ChatRoomMember> listChatRoomMember = chatRoomMemberRepository.findAll(chatRoomMemberCriteria.getCriteria(), pageable);
        ResponseListDto<List<ChatRoomMemberDto>> responseListObj = new ResponseListDto<>();
        List<ChatRoomMemberDto> dtos = chatRoomMemberMapper.fromEntityListToChatRoomMemberDtoList(listChatRoomMember.getContent());
        Long ownerId = chatroom.getOwner().getId();
        Long currentUserId = getCurrentUser();
        for (ChatRoomMemberDto dto : dtos) {
            dto.setIsOwner(ownerId.equals(dto.getMember().getId()));
            dto.setIsYou(currentUserId.equals(dto.getMember().getId()));
        }
        responseListObj.setContent(dtos);
        responseListObj.setTotalPages(listChatRoomMember.getTotalPages());
        responseListObj.setTotalElements(listChatRoomMember.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list chat room member success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> create(@Valid @RequestBody CreateChatRoomMemberForm form, BindingResult bindingResult) {
        Account currentUser = accountRepository.findById(getCurrentUser()).orElse(null);
        if (currentUser == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found current user");
        }
        List<ChatRoomMember> chatRoomMembers = new ArrayList<>();
        ChatRoom chatroom = chatroomRepository.findById(form.getChatRoomId()).orElse(null);
        if (chatroom == null) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_ERROR_NOT_FOUND, "Not found room");
        }
        if (!Objects.equals(chatroom.getKind(), FinanceConstant.CHATROOM_KIND_GROUP)) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_ERROR_NOT_KIND_GROUP, "Chat room kind is not kind group");
        }
        boolean isOwnerOfChatRoom = checkOwnerChatRoom(getCurrentUser(), chatroom.getId());
        boolean allowNotOwnerCanInvite = messageService.getSettingOfChatRoom(chatroom.getSettings()).getMember_permissions().getAllow_invite_members();
        boolean isMemberOfChatRoom = checkIsMemberOfChatRoom(getCurrentUser(), chatroom.getId());
        if (!isMemberOfChatRoom) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_MEMBER_ERROR_NO_JOIN, "Current user is not member of group");
        }
        if (!allowNotOwnerCanInvite && !isOwnerOfChatRoom) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_ERROR_UNABLE_INVITE_NEW_MEMBERS, "Owner allow add new member");
        }
        List<Account> accounts = accountRepository.findAllByIdInAndStatusAndIdNot(form.getMemberIds(), FinanceConstant.STATUS_ACTIVE, currentUser.getId());
        if (accounts.isEmpty()) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_MEMBER_ERROR_NEW_CHAT_ROOM_MEMBERS_EMPTY, "New members is empty");
        }
        List<Long> accountIds = accounts.stream().map(Account::getId).collect(Collectors.toList());
        if (chatRoomMemberRepository.checkExistChatRoomMemberInAccountIds(accountIds, chatroom.getId())) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_MEMBER_ERROR_EXISTED_IN_CHAT_ROOM, "Exists account in chat room");
        }
        for (Account account : accounts) {
            ChatRoomMember chatRoomMember = new ChatRoomMember();
            chatRoomMember.setMember(account);
            chatRoomMember.setChatRoom(chatroom);
            chatRoomMembers.add(chatRoomMember);
        }
        chatRoomMemberRepository.saveAll(chatRoomMembers);
        chatService.sendMsgChatRoomCreated(chatroom.getId(), accountIds);
        chatService.sendMsgChatRoomUpdated(chatroom.getId(), chatRoomMemberRepository.findAllMemberIdsByChatRoomIdAndNotIn(chatroom.getId(), accountIds));
        return makeSuccessResponse(null, "Create chat room member success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Long currentUserId = getCurrentUser();
        ChatRoomMember chatRoomMember = chatRoomMemberRepository.findFirstByIdOrMemberId(id, id).orElse(null);
        if (chatRoomMember == null) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_MEMBER_ERROR_NOT_FOUND, "Not found chat room member");
        }
        if (chatRoomMember.getMember().getId().equals(currentUserId)) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_MEMBER_IS_OWNER, "Cannot delete yourself");
        }
        ChatRoom chatRoom = chatRoomMember.getChatRoom();
        if (!Objects.equals(chatRoom.getKind(), FinanceConstant.CHATROOM_KIND_GROUP)) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_ERROR_NOT_KIND_GROUP, "Chat room kind is not kind group");
        }
        if (Objects.equals(chatRoomMember.getMember().getId(), chatRoom.getOwner().getId())) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_MEMBER_IS_OWNER, "Not allowed to delete owner");
        }
        boolean isOwnerOfChatRoom = checkOwnerChatRoom(currentUserId, chatRoom.getId());
        if (!isOwnerOfChatRoom) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_ERROR_NO_OWNER, "Can not delete member if not owner");
        }
        chatService.sendMsgChatRoomDeleted(chatRoom.getId(), List.of(chatRoomMember.getMember().getId()));
        chatService.sendMsgChatRoomUpdated(chatRoom.getId(), chatRoomMemberRepository.findAllMemberIdsByChatRoomIdAndNotIn(chatRoom.getId(), List.of(chatRoomMember.getMember().getId())));
        messageService.deleteDataOfMemberOfChatRoom(chatRoom.getId(), chatRoomMember.getMember().getId());
        return makeSuccessResponse(null, "Delete chat room member success");
    }

    @DeleteMapping(value = "/leave/{chatroomId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> leave(@PathVariable("chatroomId") Long chatroomId) {
        Account currentUser = accountRepository.findById(getCurrentUser()).orElse(null);
        if (currentUser == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found current user");
        }
        ChatRoom chatroom = chatroomRepository.findById(chatroomId).orElse(null);
        if (chatroom == null) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_ERROR_NOT_FOUND, "Not found room");
        }
        Long currentUserId = currentUser.getId();
        boolean isOwnerOfChatRoom = checkOwnerChatRoom(currentUserId, chatroom.getId());
        boolean isMember = checkIsMemberOfChatRoom(currentUserId, chatroomId);
        if (!isMember) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_MEMBER_ERROR_NO_JOIN, "Current user is not member of chatroom");
        }
        if (!FinanceConstant.CHATROOM_KIND_GROUP.equals(chatroom.getKind())) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_ERROR_NOT_KIND_GROUP, "Chat room is not kind group");
        }
        if (isOwnerOfChatRoom) {
            chatService.sendMsgChatRoomDeleted(chatroom.getId());
            messageService.deleteDataOfChatRoom(chatroomId);
        } else {
            chatService.sendMsgChatRoomDeleted(chatroomId, List.of(currentUserId));
            chatService.sendMsgChatRoomUpdated(chatroomId, chatRoomMemberRepository.findAllMemberIdsByChatRoomIdAndNotIn(chatroomId, List.of(currentUserId)));
            messageService.deleteDataOfMemberOfChatRoom(chatroomId, currentUserId);
        }
        return makeSuccessResponse(null, "Leave chat room success");
    }
}