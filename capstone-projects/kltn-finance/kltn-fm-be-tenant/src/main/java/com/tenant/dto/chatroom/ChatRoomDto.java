package com.tenant.dto.chatroom;

import com.tenant.dto.ABasicAdminDto;
import com.tenant.dto.account.AccountDto;
import com.tenant.dto.message.MessageDto;
import lombok.Data;

import java.util.Date;

@Data
public class ChatRoomDto extends ABasicAdminDto {
    private String name;
    private String avatar;
    private Integer kind;
    private String settings;

    private MessageDto lastMessage;
    private Long totalUnreadMessages;

    // Group
    private Long totalMembers;
    private Boolean isOwner;
    private AccountDto owner;

    // Direct message
    private Date lastLogin;
}