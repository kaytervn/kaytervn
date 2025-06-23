package com.tenant.service.impl;

import com.tenant.jwt.FinanceJwt;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserServiceImpl {
    @SuppressWarnings("unchecked")
    private Map<String, Object> getDecodedDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            OAuth2AuthenticationDetails oauthDetails = (OAuth2AuthenticationDetails) authentication.getDetails();
            if (oauthDetails != null && oauthDetails.getDecodedDetails() != null) {
                return (Map<String, Object>) oauthDetails.getDecodedDetails();
            }
        }
        return null;
    }

    public FinanceJwt getAddInfoFromToken() {
        Map<String, Object> decodedDetails = getDecodedDetails();
        if (decodedDetails != null) {
            String encodedData = (String) decodedDetails.get("additional_info");
            if (encodedData != null && !encodedData.isEmpty()) {
                return FinanceJwt.decode(encodedData);
            }
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    public List<String> getAuthorities() {
        Map<String, Object> decodedDetails = getDecodedDetails();
        if (decodedDetails != null) {
            List<String> authorities = (List<String>) decodedDetails.get("authorities");
            if (authorities != null) {
                return authorities.stream().map(authority -> authority.replace("ROLE_", "")).collect(Collectors.toList());
            }
        }
        return null;
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

    @SuppressWarnings("unchecked")
    public Map<String, Object> getAttributesFromToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            OAuth2AuthenticationDetails oauthDetails =
                    (OAuth2AuthenticationDetails) authentication.getDetails();
            if (oauthDetails != null) {
                return (Map<String, Object>) oauthDetails.getDecodedDetails();
            }
        }
        return null;
    }
}
