package com.finance.data.model.api.response.chat;

import java.time.ZonedDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageReaction {
    //Emoji
    public static final String EMOJI_KIND_1 = "\uD83D\uDC4D";
    public static final String EMOJI_KIND_2= "❤";
    public static final String EMOJI_KIND_3 = "😭";
    public static final String EMOJI_KIND_4 = "☺\uFE0F";
    public static final String EMOJI_KIND_5 = "\uD83D\uDE02";


    public AccountChatResponse account;
    public String createdDate;
    public Long id;
    public Integer kind;
    public String modifiedDate;
    public Integer status;
    public Integer totalReactions;

    public List<AccountChatResponse> accountReactions;

    public Boolean compareTo(MessageReaction other) {
        if (other == null) {
            return false;
        }
        if (this.id == null || other.getId() == null) {
            return false;
        }
        if (!this.kind.equals(other.getKind())) {
            return false;
        }
        return true;
    }

    public static Boolean listCompare(List<MessageReaction> otherReactions1, List<MessageReaction> otherReactions2) {
        if (otherReactions1 == null || otherReactions2.isEmpty()) {
            return false;
        }
        if (otherReactions1.size() != otherReactions2.size()) {
            return false;
        }
        return true;
    }

    public String getEmojiByKind() {
        switch (kind) {
            case 1:
                return EMOJI_KIND_1;
            case 2:
                return EMOJI_KIND_2;
            case 3:
                return EMOJI_KIND_3;
            case 4:
                return EMOJI_KIND_4;
            case 5:
                return EMOJI_KIND_5;
            default:
                return "";
        }
    }
}
