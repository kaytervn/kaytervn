package com.base.auth.dto.user;

import com.base.auth.dto.account.AccountAutoCompleteDto;
import lombok.Data;

@Data
public class UserAutoCompleteDto {

    private Long id;
    private AccountAutoCompleteDto accountAutoCompleteDto;
}
