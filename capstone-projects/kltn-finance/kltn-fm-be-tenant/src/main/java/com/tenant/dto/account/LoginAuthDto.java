package com.tenant.dto.account;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class LoginAuthDto {
    @JsonProperty("access_token")
    private String accessToken;
    @JsonProperty("token_type")
    private String tokenType;
    @JsonProperty("refresh_token")
    private String refreshToken;
    @JsonProperty("user_id")
    private Long userId;
    @JsonProperty("user_kind")
    private Integer userKind;
    @JsonProperty("grant_type")
    private String grantType;
}
