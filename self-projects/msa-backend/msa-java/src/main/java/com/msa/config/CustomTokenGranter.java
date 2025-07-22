package com.msa.config;

import com.msa.constant.SecurityConstant;
import com.msa.service.impl.UserServiceImpl;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.common.exceptions.InvalidTokenException;
import org.springframework.security.oauth2.provider.*;
import org.springframework.security.oauth2.provider.token.AbstractTokenGranter;
import org.springframework.security.oauth2.provider.token.AuthorizationServerTokenServices;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.Objects;

public class CustomTokenGranter extends AbstractTokenGranter {
    private final UserServiceImpl userService;

    public CustomTokenGranter(AuthorizationServerTokenServices tokenServices, ClientDetailsService clientDetailsService, OAuth2RequestFactory requestFactory, String grantType, UserServiceImpl userService) {
        super(tokenServices, clientDetailsService, requestFactory, grantType);
        this.userService = userService;
    }

    @Override
    protected OAuth2Authentication getOAuth2Authentication(ClientDetails client, TokenRequest tokenRequest) {
        return super.getOAuth2Authentication(client, tokenRequest);
    }

    protected OAuth2AccessToken getAccessToken(ClientDetails client, TokenRequest tokenRequest) {
        String username = tokenRequest.getRequestParameters().get("username");
        String password = tokenRequest.getRequestParameters().get("password");
        String totp = tokenRequest.getRequestParameters().get("totp");
        String grantType = tokenRequest.getGrantType();
        try {
            if (!Objects.equals(SecurityConstant.GRANT_TYPE_PASSWORD, grantType)) {
                throw new InvalidTokenException("Invalid grant type: " + tokenRequest.getGrantType());
            }
            return userService.getAccessTokenForMultipleTenancies(client, tokenRequest, username, password, this.getTokenServices());
        } catch (GeneralSecurityException | IOException e) {
            throw new InvalidTokenException("Account is invalid");
        }
    }
}
