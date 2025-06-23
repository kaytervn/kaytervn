package com.tenant.dto.message.reation;

import com.tenant.dto.ABasicAdminDto;
import com.tenant.dto.account.AccountDto;
import com.tenant.dto.message.MessageDto;
import lombok.Data;

@Data
public class MessageReactionDto extends ABasicAdminDto {
    private AccountDto account;
    private MessageDto message;
    private Integer kind;
}