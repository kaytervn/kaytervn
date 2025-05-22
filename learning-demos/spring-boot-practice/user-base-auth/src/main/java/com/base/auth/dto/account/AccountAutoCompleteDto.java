package com.base.auth.dto.account;

import lombok.Data;

@Data
public class AccountAutoCompleteDto {
    private long id;
    private String fullName;
    private String avatarPath;
}
