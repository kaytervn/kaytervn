package com.msa.dto.auth;

import lombok.Data;

@Data
public class UserTokenDto {
    private Long id;
    private Integer kind;
    private String username;
    private Boolean isSuperAdmin;
}
