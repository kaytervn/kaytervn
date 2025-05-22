package com.base.auth.dto.user;

import com.base.auth.dto.account.AccountDto;
import lombok.Data;

import java.util.Date;

@Data
public class UserDto {

    private Long id;
    private Date birthday;
    private AccountDto account;

}
