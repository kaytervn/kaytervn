package com.finance.data.model.api.response.login;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    String access_token;
    String token_type;
    String refresh_token;
    Long expires_in;
    String scope;
    Long user_kind;
    Long user_id;
    String grant_type;
    String additional_info;
    String jti;
}
