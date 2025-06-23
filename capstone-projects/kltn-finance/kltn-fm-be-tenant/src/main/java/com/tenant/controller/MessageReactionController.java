package com.tenant.controller;

import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.exception.BadRequestException;
import com.tenant.form.message.reaction.ReactMessageReactionForm;
import com.tenant.service.chat.SocketClientChatService;
import com.tenant.storage.tenant.model.Account;
import com.tenant.storage.tenant.model.ChatRoom;
import com.tenant.storage.tenant.model.Message;
import com.tenant.storage.tenant.model.MessageReaction;
import com.tenant.storage.tenant.repository.AccountRepository;
import com.tenant.storage.tenant.repository.MessageReactionRepository;
import com.tenant.storage.tenant.repository.MessageRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/v1/message-reaction")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class MessageReactionController extends ABasicController {
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private MessageReactionRepository messageReactionRepository;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private SocketClientChatService chatService;

    @PostMapping(value = "/react", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> react(@Valid @RequestBody ReactMessageReactionForm form, BindingResult bindingResult) {
        Long getCurrentId = getCurrentUser();
        Account account = accountRepository.findById(getCurrentId).orElse(null);
        if (account == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        Message message = messageRepository.findById(form.getMessageId()).orElse(null);
        if (message == null) {
            throw new BadRequestException(ErrorCode.MESSAGE_ERROR_NOT_FOUND, "Not found message");
        }
        ChatRoom chatroom = message.getChatRoom();
        boolean isMemberOfChatRoom = checkIsMemberOfChatRoom(getCurrentId, chatroom.getId());
        if (!isMemberOfChatRoom) {
            throw new BadRequestException(ErrorCode.CHAT_ROOM_MEMBER_ERROR_NO_JOIN, "Current user is not member of chatroom");
        }
        messageReactionRepository.deleteAllByAccountIdAndMessageId(account.getId(), message.getId());
        MessageReaction messageReaction = new MessageReaction();
        messageReaction.setAccount(account);
        messageReaction.setKind(form.getKind());
        messageReaction.setMessage(message);
        messageReactionRepository.save(messageReaction);
        chatService.broadcastMessageUpdated(chatroom.getId(), message.getId());
        return makeSuccessResponse(null, "React message success");
    }

    @DeleteMapping(value = "/delete/{mesageId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<String> delete(@PathVariable("mesageId") Long mesageId) {
        Message message = messageRepository.findById(mesageId).orElse(null);
        if (message == null) {
            throw new BadRequestException(ErrorCode.MESSAGE_ERROR_NOT_FOUND, "Not found message");
        }
        Account account = accountRepository.findById(getCurrentUser()).orElse(null);
        if (account == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        messageReactionRepository.deleteAllByAccountIdAndMessageId(account.getId(), message.getId());
        chatService.broadcastMessageUpdated(message.getChatRoom().getId(), message.getId());
        return makeSuccessResponse(null, "Delete message reaction success");
    }
}
