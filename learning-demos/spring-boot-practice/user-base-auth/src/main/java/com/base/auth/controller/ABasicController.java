package com.base.auth.controller;

import com.base.auth.constant.UserBaseConstant;
import com.base.auth.jwt.UserBaseJwt;
import com.base.auth.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;

import java.util.Objects;

public class ABasicController {
    @Autowired
    private UserServiceImpl userService;

    public long getCurrentUser(){
        UserBaseJwt userBaseJwt = userService.getAddInfoFromToken();
        return userBaseJwt.getAccountId();
    }

    public long getTokenId(){
        UserBaseJwt userBaseJwt = userService.getAddInfoFromToken();
        return userBaseJwt.getTokenId();
    }

    public UserBaseJwt getSessionFromToken(){
        return userService.getAddInfoFromToken();
    }

    public boolean isSuperAdmin(){
        UserBaseJwt userBaseJwt = userService.getAddInfoFromToken();
        if(userBaseJwt !=null){
            return userBaseJwt.getIsSuperAdmin();
        }
        return false;
    }

    public boolean isShop(){
        UserBaseJwt userBaseJwt = userService.getAddInfoFromToken();
        if(userBaseJwt !=null){
            return Objects.equals(userBaseJwt.getUserKind(), UserBaseConstant.USER_KIND_MANAGER);
        }
        return false;
    }

    public String getCurrentToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            OAuth2AuthenticationDetails oauthDetails =
                    (OAuth2AuthenticationDetails) authentication.getDetails();
            if (oauthDetails != null) {
                return oauthDetails.getTokenValue();
            }
        }
        return null;
    }
}
