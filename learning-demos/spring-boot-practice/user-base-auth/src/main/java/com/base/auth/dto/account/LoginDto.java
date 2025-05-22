package com.base.auth.dto.account;

import lombok.Data;

import java.util.Date;

@Data
public class LoginDto {
    private String username;
    private String phoneNumber;
    private String token;
    private String fullName;
    private long id;
    private Date expired;
    private Integer kind;

    private String firebaseAppId;
    private String firebaseApiKey;
    private Boolean requirePhoneValidation = false;
}
