package com.msa.dto.auth;

import lombok.Data;

@Data
public class RequestInfoDto {
    private Long userId;
    private String username;
    private String grantType;
}
