package com.finance.data.model.api.response.chat.detail;

import com.finance.data.model.api.ApiModelUtils;
import com.finance.data.model.api.response.chat.AccountChatResponse;
import com.finance.data.model.api.response.chat.MessageReaction;
import com.finance.data.model.api.response.document.DocumentResponse;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatDetailResponse {
    public static final int TYPE_TOP = 0;
    public static final int TYPE_MIDDLE = 1;
    public static final int TYPE_BOTTOM = 2;
    private Long id;
    private String createdDate;
    private AccountChatResponse sender;
    private String content;
    private Boolean isChildren;
    private Boolean isSender;
    private Boolean isReacted;
    private Integer totalReactions;
    private Integer totalSeenMembers;
    private List<AccountChatResponse> seenMembers;
    private Boolean isDeleted;
    private Boolean isUpdated;
    private List<MessageReaction> messageReactions;
    private String document;
    private Integer positionInChat;

    public List<DocumentResponse> getDocumentFile() {
        if (document == null || document.isEmpty()) {
            return null;
        }
        Gson gson = new Gson();
        Type listType = new TypeToken<List<DocumentResponse>>() {}.getType();
        return gson.fromJson(document, listType);
    }

    public Boolean compareMessage(ChatDetailResponse otherMessage) {
        if (otherMessage == null) {
            return false;
        }
        if (this.id == null || otherMessage.getId() == null) {
            return false;
        }
        if (!content.equals(otherMessage.getContent())) {
            return false;
        }
        if (!document.equals(otherMessage.getDocument())) {
            return false;
        }
//        if (!messageReactions.listCompare(otherMessage.getMessageReactions())) {
//            return false;
//        }
        return true;
    }
}
