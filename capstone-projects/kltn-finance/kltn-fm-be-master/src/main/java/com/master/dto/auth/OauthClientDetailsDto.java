package com.master.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OauthClientDetailsDto {
    private String clientId;
    private String scope;
    private String authorizedGrantTypes;
    private Integer accessTokenValidInSeconds;
    private Integer refreshTokenValidInSeconds;
}
