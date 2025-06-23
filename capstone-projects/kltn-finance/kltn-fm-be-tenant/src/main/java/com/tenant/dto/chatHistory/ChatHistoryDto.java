package com.tenant.dto.chatHistory;

import com.tenant.dto.ABasicAdminDto;
import com.tenant.dto.account.AccountDto;
import lombok.Data;

@Data
public class ChatHistoryDto extends ABasicAdminDto {
    private Integer role;
    private String message;
    private AccountDto account;
}
