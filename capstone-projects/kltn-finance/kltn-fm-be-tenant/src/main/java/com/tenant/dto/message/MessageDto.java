package com.tenant.dto.message;

import com.tenant.dto.ABasicAdminDto;
import com.tenant.dto.account.AccountDto;
import com.tenant.dto.message.reation.MessageReactionDto;
import lombok.Data;
import java.util.*;

@Data
public class MessageDto extends ABasicAdminDto {
    private AccountDto sender;
    private String content;
    private String document;
    private MessageDto parent;
    private List<MessageReactionDto> messageReactions;
    private Boolean isChildren;
    private Boolean isSender;
    private Boolean isReacted;
    private Long totalReactions;
    private Long totalSeenMembers;
    private Integer myReaction;
    private List<AccountDto> seenMembers;
    private Boolean isDeleted;
    private Boolean isUpdated;
}