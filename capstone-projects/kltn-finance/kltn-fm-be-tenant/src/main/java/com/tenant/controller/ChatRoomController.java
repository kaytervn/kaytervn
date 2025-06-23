package com.tenant.controller;

import com.tenant.cache.SessionService;
import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.chatroom.*;
import com.tenant.exception.BadRequestException;
import com.tenant.form.chatroom.CreateChatRoomDirectForm;
import com.tenant.form.chatroom.CreateChatRoomForm;
import com.tenant.form.chatroom.UpdateChatRoomForm;
import com.tenant.mapper.ChatRoomMapper;
import com.tenant.mapper.MessageMapper;
import com.tenant.service.KeyService;
import com.tenant.service.MessageService;
import com.tenant.service.chat.SocketClientChatService;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.model.Account;
import com.tenant.storage.tenant.model.ChatRoom;
import com.tenant.storage.tenant.model.criteria.ChatRoomCriteria;
import com.tenant.storage.tenant.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/v1/chat-room")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatRoomController extends ABasicController {
    @Autowired
    private ChatRoomMemberRepository chatRoomMemberRepository;
    @Autowired
    private ChatRoomRepository chatroomRepository;
    @Autowired
    private ChatRoomMapper chatRoomMapper;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private MessageMapper messageMapper;
    @Autowired
    private KeyService keyService;
    @Autowired
    private SocketClientChatService chatService;
    @Autowired
    private SessionService sessionService;
    @Autowired
    private MessageService messageService;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ChatRoomDto> get(@PathVariable("id") Long id) {
        ChatRoom chatroom = chatroomRepository.findById(id).orElse(null);
        if (chatroom == null) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_ERROR_NOT_FOUND, "Not found chatroom");
        }
        ChatRoomDto dto = chatRoomMapper.fromEntityToChatRoomDto(chatroom);
        Message lastMessage = messageRepository.findLastMessageByChatRoomId(chatroom.getId()).orElse(null);
        if (lastMessage != null) {
            dto.setLastMessage(messageMapper.fromEntityToMessageDto(lastMessage, keyService.getFinanceKeyWrapper()));
        }
        dto.setTotalUnreadMessages(chatroomRepository.countUnreadMessagesByChatRoomId(chatroom.getId(), getCurrentUser()));
        if (FinanceConstant.CHATROOM_KIND_DIRECT_MESSAGE.equals(chatroom.getKind())) {
            Account other = chatroomRepository.findOtherMemberInDirectMessages(chatroom.getId(), getCurrentUser(), FinanceConstant.CHATROOM_KIND_DIRECT_MESSAGE);
            dto.setOwner(null);
            dto.setSettings(null);
            dto.setAvatar(other.getAvatarPath());
            dto.setName(other.getFullName());
            dto.setLastLogin(sessionService.getLastLoginByAccount(other));
        } else {
            dto.setTotalMembers(chatRoomMemberRepository.countAllByChatRoomId(chatroom.getId()));
            dto.setIsOwner(Objects.equals(getCurrentUser(), chatroom.getOwner().getId()));
        }
        return makeSuccessResponse(dto, "Get chatroom success");
    }

    private LocalDateTime getSortDate(ChatRoomDto dto) {
        if (dto.getLastMessage() != null) {
            return dto.getLastMessage().getCreatedDate();
        } else {
            return dto.getCreatedDate();
        }
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<ChatRoomDto>>> list(ChatRoomCriteria chatroomCriteria, Pageable pageable) {
        ResponseListDto<List<ChatRoomDto>> responseListObj = new ResponseListDto<>();
        if (chatroomCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        Long currentUserId = getCurrentUser();
        chatroomCriteria.setMemberId(currentUserId);
        Page<ChatRoom> chatRoomPage = chatroomRepository.findAll(chatroomCriteria.getCriteria(), pageable);
        List<ChatRoom> chatRooms = chatRoomPage.getContent();
        List<Long> chatRoomIds = chatRooms.stream().map(ChatRoom::getId).collect(Collectors.toList());

        Map<Long, Long> memberCountMap = chatroomRepository.countMembersByChatRoomIds(chatRoomIds)
                .stream()
                .collect(Collectors.toMap(ChatRoomMemberCountInterface::getChatRoomId, ChatRoomMemberCountInterface::getMemberCount));
        Map<Long, Message> lastMessageMap = chatroomRepository.findLastMessagesByChatRoomIds(chatRoomIds)
                .stream()
                .collect(Collectors.toMap(ChatRoomLastMessageInterface::getChatRoomId, ChatRoomLastMessageInterface::getLastMessage, (m1, m2) -> m1.getId() > m2.getId() ? m1 : m2));
        Map<Long, Long> unreadCountMap = chatroomRepository.countUnreadMessages(chatRoomIds, currentUserId)
                .stream()
                .collect(Collectors.toMap(ChatRoomUnreadCountInterface::getChatRoomId, ChatRoomUnreadCountInterface::getUnreadCount));
        List<Object[]> rawResults = chatroomRepository.findChatRoomAccounts(chatRoomIds, currentUserId, FinanceConstant.CHATROOM_KIND_DIRECT_MESSAGE);
        Map<Long, Account> chatRoomAccountMap = rawResults.stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (Account) row[1]
                ));

        List<ChatRoomDto> dtos = chatRooms.stream().map(chatRoom -> {
            ChatRoomDto dto = chatRoomMapper.fromEntityToChatRoomDto(chatRoom);
            dto.setTotalMembers(memberCountMap.getOrDefault(chatRoom.getId(), 0L));
            if (Objects.equals(chatRoom.getKind(), FinanceConstant.CHATROOM_KIND_DIRECT_MESSAGE)) {
                dto.setOwner(null);
                Account otherMember = chatRoomAccountMap.get(chatRoom.getId());
                if (otherMember != null) {
                    dto.setName(otherMember.getFullName());
                    dto.setAvatar(otherMember.getAvatarPath());
                    dto.setLastLogin(otherMember.getLastLogin());
                }
            }
            Message lastMessage = lastMessageMap.get(chatRoom.getId());
            if (lastMessage != null) {
                dto.setLastMessage(messageMapper.fromEntityToMessageDto(lastMessage, keyService.getFinanceKeyWrapper()));
            }
            dto.setTotalUnreadMessages(unreadCountMap.getOrDefault(chatRoom.getId(), 0L));
            return dto;
        }).sorted(Comparator.comparing(this::getSortDate, Comparator.reverseOrder())).collect(Collectors.toList());

        responseListObj.setContent(dtos);
        responseListObj.setTotalPages(chatRoomPage.getTotalPages());
        responseListObj.setTotalElements(chatRoomPage.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list chatroom success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<ChatRoomDto>>> autoComplete(ChatRoomCriteria chatroomCriteria, @PageableDefault Pageable pageable) {
        chatroomCriteria.setStatus(FinanceConstant.STATUS_ACTIVE);
        if (chatroomCriteria.getIsPaged().equals(FinanceConstant.IS_PAGED_FALSE)) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }
        Page<ChatRoom> listChatRoom = chatroomRepository.findAll(chatroomCriteria.getCriteria(), pageable);
        ResponseListDto<List<ChatRoomDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(chatRoomMapper.fromEntityListToChatRoomDtoListAutoComplete(listChatRoom.getContent()));
        responseListObj.setTotalPages(listChatRoom.getTotalPages());
        responseListObj.setTotalElements(listChatRoom.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list auto-complete chatroom success");
    }

    @PostMapping(value = "/create-group", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> createGroup(@Valid @RequestBody CreateChatRoomForm form, BindingResult bindingResult) {
        ChatRoom chatroom = chatRoomMapper.fromCreateChatRoomFormToEntity(form);
        Account owner = accountRepository.findById(getCurrentUser()).orElse(null);
        if (owner == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found owner");
        }
        chatroom.setOwner(owner);
        chatroom.setSettings(form.getSettings());
        chatroom.setKind(FinanceConstant.CHATROOM_KIND_GROUP);
        List<Account> accounts = accountRepository.findAllByIdInAndStatusAndIdNot(form.getMemberIds(), FinanceConstant.STATUS_ACTIVE, owner.getId());
        if (accounts.size() < 2) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_MEMBER_ERROR_KIND_GROUP_HAS_MORE_THAN_3, "number of list members can not less than 2");
        }
        List<ChatRoomMember> chatRoomMembers = new ArrayList<>();
        accounts.add(owner);
        for (Account account : accounts) {
            ChatRoomMember newChatRoomMember = new ChatRoomMember();
            newChatRoomMember.setMember(account);
            newChatRoomMember.setChatRoom(chatroom);
            chatRoomMembers.add(newChatRoomMember);
        }
        chatroomRepository.save(chatroom);
        chatRoomMemberRepository.saveAll(chatRoomMembers);
        chatService.sendMsgChatRoomCreated(chatroom.getId());
        return makeSuccessResponse(null, "Create chatroom group success");
    }

    @PostMapping(value = "/create-direct-message", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ChatRoomDto> createDirectMessage(@Valid @RequestBody CreateChatRoomDirectForm form, BindingResult bindingResult) {
        ChatRoom chatroom = new ChatRoom();
        Account owner = accountRepository.findById(getCurrentUser()).orElse(null);
        if (owner == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found owner");
        }
        chatroom.setOwner(owner);
        chatroom.setKind(FinanceConstant.CHATROOM_KIND_DIRECT_MESSAGE);
        Account other = accountRepository.findFirstByIdAndStatusAndIdNot(form.getAccountId(), FinanceConstant.STATUS_ACTIVE, owner.getId()).orElse(null);
        if (other == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found other");
        }

        List<ChatRoomMember> chatRoomMembers = new ArrayList<>();
        ChatRoomMember chatRoomMemberOwner = new ChatRoomMember();
        chatRoomMemberOwner.setMember(owner);
        chatRoomMemberOwner.setChatRoom(chatroom);
        chatRoomMembers.add(chatRoomMemberOwner);

        ChatRoomMember chatRoomMemberOther = new ChatRoomMember();
        chatRoomMemberOther.setMember(other);
        chatRoomMemberOther.setChatRoom(chatroom);
        chatRoomMembers.add(chatRoomMemberOther);

        chatroomRepository.save(chatroom);
        chatRoomMemberRepository.saveAll(chatRoomMembers);

        ChatRoomDto newChatRoomDto = chatRoomMapper.fromEntityToChatRoomDto(chatroom);
        chatService.sendMsgChatRoomCreated(chatroom.getId());
        return makeSuccessResponse(newChatRoomDto, "Create chatroom direct message success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> update(@Valid @RequestBody UpdateChatRoomForm form, BindingResult bindingResult) {
        Account currentUser = accountRepository.findById(getCurrentUser()).orElse(null);
        if (currentUser == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found current user");
        }
        ChatRoom chatroom = chatroomRepository.findById(form.getId()).orElse(null);
        if (chatroom == null) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_ERROR_NOT_FOUND, "Not found chatroom");
        }
        if (FinanceConstant.CHATROOM_KIND_DIRECT_MESSAGE.equals(chatroom.getKind())) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_ERROR_DIRECT_MESSAGE_NOT_UPDATE, "chat room direct can not update");
        }
        boolean allowNotOwnerCanUpdate = messageService.getSettingOfChatRoom(chatroom.getSettings()).getMember_permissions().getAllow_update_chat_room();
        boolean checkIsOwner = checkOwnerChatRoom(getCurrentUser(), chatroom.getId());
        if (!checkIsOwner && !allowNotOwnerCanUpdate) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_MEMBER_ERROR_IS_NOT_OWNER_AND_NOT_ALLOW_UPDATE, "Chat room updated by owner or not owner if allow to update");
        }
        chatRoomMapper.fromUpdateChatRoomFormToEntity(form, chatroom);
        if (checkIsOwner) {
            chatroom.setSettings(form.getSettings());
        }
        chatroomRepository.save(chatroom);
        chatService.sendMsgChatRoomUpdated(chatroom.getId());
        return makeSuccessResponse(null, "Update chatroom success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        Account currentUser = accountRepository.findById(getCurrentUser()).orElse(null);
        if (currentUser == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found current user");
        }
        ChatRoom chatroom = chatroomRepository.findById(id).orElse(null);
        if (chatroom == null) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_ERROR_NOT_FOUND, "Not found chatroom");
        }
        boolean checkIsOwner = checkOwnerChatRoom(getCurrentUser(), chatroom.getId());
        boolean checkIsMember = checkIsMemberOfChatRoom(getCurrentUser(),chatroom.getId());
        if(FinanceConstant.CHATROOM_KIND_GROUP.equals(chatroom.getKind()) && !checkIsOwner){
            throw new BadRequestException(ErrorCode.CHAT_ROOM_ERROR_NO_OWNER,"Can not delete if not owner");
        }
        if(FinanceConstant.CHATROOM_KIND_DIRECT_MESSAGE.equals(chatroom.getKind()) && !checkIsMember){
            throw new BadRequestException(ErrorCode.CHAT_ROOM_ERROR_NO_OWNER, "Can not delete if is not member");
        }
        chatService.sendMsgChatRoomDeleted(chatroom.getId());
        messageService.deleteDataOfChatRoom(chatroom.getId());
        return makeSuccessResponse(null, "Delete chatroom success");
    }
}