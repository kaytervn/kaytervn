package com.finance.data.model.api.response.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageModelResponse {
    private Long id;
    private String createdDate;
    private AccountChatResponse sender;
    private String username;
    private String fullName;
    private String avatarPath;
    private String content;
    private Boolean isChildren;
    private Boolean isSender;
    private Boolean isReacted;
    private Integer totalReactions;
    private Integer totalSeenMembers;
    private Boolean isDeleted;
    private Boolean isUpdated;
    private String document;
}
