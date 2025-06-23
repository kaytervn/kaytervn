package com.master.controller;

import com.master.dto.ApiMessageDto;
import com.master.jwt.MasterJwt;
import com.master.service.impl.UserServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;

public class ABasicController {
    @Autowired
    private UserServiceImpl userService;

    public long getCurrentUser() {
        MasterJwt masterJwt = userService.getAddInfoFromToken();
        return masterJwt.getAccountId();
    }

    public boolean isSuperAdmin() {
        MasterJwt masterJwt = userService.getAddInfoFromToken();
        if (masterJwt != null) {
            return masterJwt.getIsSuperAdmin();
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

    public <T> ApiMessageDto<T> makeErrorResponse(String code, String message) {
        ApiMessageDto<T> apiMessageDto = new ApiMessageDto<>();
        apiMessageDto.setResult(false);
        apiMessageDto.setCode(code);
        apiMessageDto.setMessage(message);
        return apiMessageDto;
    }

    public <T> ApiMessageDto<T> makeSuccessResponse(T data, String message) {
        ApiMessageDto<T> apiMessageDto = new ApiMessageDto<>();
        apiMessageDto.setData(data);
        apiMessageDto.setMessage(message);
        return apiMessageDto;
    }

    public String getCurrentTenantName() {
        String tenantName = userService.getAttributeFromToken("tenant_name");
        if (StringUtils.isBlank(tenantName)) {
            return "<>";
        }
        return tenantName;
    }
}
