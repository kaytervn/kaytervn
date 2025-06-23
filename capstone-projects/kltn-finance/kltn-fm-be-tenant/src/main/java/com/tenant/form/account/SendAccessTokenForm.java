package com.tenant.form.account;

import lombok.Data;

@Data
public class SendAccessTokenForm {
    private String accessToken;
    private String clientId;
}
