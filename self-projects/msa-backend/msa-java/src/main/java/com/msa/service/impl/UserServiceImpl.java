package com.msa.service.impl;

import com.msa.constant.ErrorCode;
import com.msa.constant.AppConstant;
import com.msa.constant.SecurityConstant;
import com.msa.exception.BadRequestException;
import com.msa.jwt.AppJwt;
import com.msa.service.TotpManager;
import com.msa.service.encryption.EncryptionService;
import com.msa.storage.master.model.DbConfig;
import com.msa.storage.master.model.Permission;
import com.msa.storage.master.model.User;
import com.msa.storage.master.repository.DbConfigRepository;
import com.msa.storage.master.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.ClientDetails;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.OAuth2Request;
import org.springframework.security.oauth2.provider.TokenRequest;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.security.oauth2.provider.token.AuthorizationServerTokenServices;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.Serializable;
import java.security.GeneralSecurityException;
import java.util.*;
import java.util.stream.Collectors;

@SuppressWarnings("unchecked")
@Service(value = AppConstant.USER_SERVICE)
@Slf4j
public class UserServiceImpl implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TotpManager totpManager;
    @Autowired
    private EncryptionService encryptionService;
    @Autowired
    private DbConfigRepository dbConfigRepository;

    @Override
    public UserDetails loadUserByUsername(String userId) {
        return null;
    }

    public AppJwt getAddInfoFromToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            OAuth2AuthenticationDetails oauthDetails =
                    (OAuth2AuthenticationDetails) authentication.getDetails();
            if (oauthDetails != null) {
                Map<String, Object> map = (Map<String, Object>) oauthDetails.getDecodedDetails();
                String encodedData = (String) map.get("additional_info");
                if (encodedData != null && !encodedData.isEmpty()) {
                    return AppJwt.decode(encodedData);
                }
                return null;
            }
        }
        return null;
    }

    public Set<GrantedAuthority> getAccountPermission(User user) {
        List<String> roles = new ArrayList<>();
        List<Permission> permissions = user.getGroup().getPermissions();
        permissions.stream().filter(f -> f.getPermissionCode() != null).forEach(pName -> roles.add(pName.getPermissionCode()));
        return roles.stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())).collect(Collectors.toSet());
    }

    private OAuth2Authentication getOAuth2Authentication(UserDetails userDetails, OAuth2Request oAuth2Request) {
        org.springframework.security.core.userdetails.User userPrincipal = new org.springframework.security.core.userdetails.User(userDetails.getUsername(), userDetails.getPassword(), userDetails.isEnabled(), userDetails.isAccountNonExpired(), userDetails.isCredentialsNonExpired(), userDetails.isAccountNonLocked(), userDetails.getAuthorities());
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userPrincipal, null, userDetails.getAuthorities());
        return new OAuth2Authentication(oAuth2Request, authenticationToken);
    }

    public OAuth2AccessToken getAccessTokenForMultipleTenancies(ClientDetails client, TokenRequest tokenRequest, String username, String password, AuthorizationServerTokenServices tokenServices) throws GeneralSecurityException, IOException {
        Map<String, String> requestParameters = new HashMap<>();
        requestParameters.put("grant_type", tokenRequest.getGrantType());
        String clientId = client.getClientId();
        boolean approved = true;
        Set<String> responseTypes = new HashSet<>();
        responseTypes.add("code");
        Map<String, Serializable> extensionProperties = new HashMap<>();
        UserDetails userDetails = loadUserByUsername(username, password, tokenRequest.getRequestParameters());
        OAuth2Request oAuth2Request = new OAuth2Request(requestParameters, clientId, userDetails.getAuthorities(), approved, client.getScope(), client.getResourceIds(), null, responseTypes, extensionProperties);
        OAuth2Authentication auth = getOAuth2Authentication(userDetails, oAuth2Request);
        return tokenServices.createAccessToken(auth);
    }

    public UserDetails loadUserByUsername(String username, String password, Map<String, String> detailsMap) {
        String totp = detailsMap.get("totp");
        User user = userRepository.findFirstByUsername(username).orElse(null);
        if (user == null || !Objects.equals(AppConstant.STATUS_ACTIVE, user.getStatus()) || !passwordEncoder.matches(password, user.getPassword())) {
            throw new BadRequestException(ErrorCode.GENERAL_ERROR_INVALID_USERNAME_OR_PASSWORD, "Invalid username or password!");
        }
        boolean enabled = true;
        Set<GrantedAuthority> grantedAuthorities = getAccountPermission(user);
        checkMFA(user, totp);
        if (Boolean.FALSE.equals(user.getIsMfa())) {
            user.setIsMfa(true);
            userRepository.save(user);
        }
        return new org.springframework.security.core.userdetails.User(username, user.getPassword(), enabled, enabled, enabled, enabled, grantedAuthorities);
    }

    private void checkMFA(User user, String totp) {
        if (totp == null) {
            throw new BadRequestException(ErrorCode.GENERAL_ERROR_TOTP_REQUIRED, "TOTP is required");
        }
        String secretKey = encryptionService.serverDecrypt(user.getSecretKey());
        if (StringUtils.isBlank(secretKey)) {
            throw new BadRequestException(ErrorCode.GENERAL_ERROR_ACCOUNT_NOT_SET_UP_2FA, "Account not setup TOTP");
        }
        if (!totpManager.verifyCode(totp, secretKey)) {
            throw new BadRequestException(ErrorCode.GENERAL_ERROR_VERIFY_TOTP_FAILED, "Verify TOTP failed");
        }
    }
}