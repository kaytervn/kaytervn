package com.finance.data.model.api.response.chat;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomMemberResponse {
    private Long id;
    private AutoCompleteAccountResponse member;
    private Boolean isOwner;
    private Boolean isYou;
}
