package com.master.dto.auth;

import lombok.Data;

@Data
public class AccountForTokenDto {
    private Long id;
    private Integer kind;
    private String username;
    private Boolean isSuperAdmin;
}
