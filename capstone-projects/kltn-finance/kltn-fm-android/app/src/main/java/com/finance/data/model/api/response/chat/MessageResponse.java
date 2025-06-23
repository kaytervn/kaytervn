package com.finance.data.model.api.response.chat;

import java.time.ZonedDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    public static final int MESSAGE_ADD = 1;
    public static final int MESSAGE_UPDATE = 2;
    private Long id;
    private String content;
    private String createdDate;
    private String document;
    private List<MessageReaction> messageReactions;
    private String modifiedDate;
    private AccountChatResponse sender;
    private Integer status;
    private Boolean isUpdated;
    private Boolean isDeleted;
    private String username;
    private String fullName;
    private String avatarPath;
    private Boolean isChildren;
    private Boolean isSender;
    private Boolean isReacted;
    private Integer totalReactions;
    private Integer totalSeenMembers;
}
