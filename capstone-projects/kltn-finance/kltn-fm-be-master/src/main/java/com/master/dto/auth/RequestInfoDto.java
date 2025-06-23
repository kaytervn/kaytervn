package com.master.dto.auth;

import lombok.Data;

@Data
public class RequestInfoDto {
    private Long userId;
    private String tenantId;
    private String username;
    private String grantType;
}
