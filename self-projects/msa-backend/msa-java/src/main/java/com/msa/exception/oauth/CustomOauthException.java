package com.msa.exception.oauth;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.oauth2.common.exceptions.OAuth2Exception;

@JsonSerialize(using = CustomOauthExceptionSerializer.class)
@Getter
@Setter
public class CustomOauthException extends OAuth2Exception {
    private String code;

    public CustomOauthException(String msg) {
        super(msg);
    }

    public CustomOauthException(String msg, String code) {
        super(msg);
        this.code = code;
    }
}
