package com.finance.data.model.api.response.chat;

import java.time.ZonedDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountChatResponse {
    public Long id;
    public String address;
    public String avatarPath;
    public String birthDate;
    public DepartmentChat department;
    public String email;
    public String fullName;
    public Group group;
    public Boolean isFaceIdRegistered;
    public Boolean isSuperAdmin;
    public Integer kind;
    public String phone;
    public String publicKey;
    public String secretKey;
    public Integer status;
    public String username;
}
