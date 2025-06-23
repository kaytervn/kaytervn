package com.finance.data.model.api.response.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AutoCompleteAccountResponse {
    private Long id;
    private String username;
    private String fullName;
    private String avatarPath;
}
