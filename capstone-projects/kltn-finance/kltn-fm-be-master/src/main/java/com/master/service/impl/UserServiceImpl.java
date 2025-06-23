package com.master.service.impl;

import com.master.config.SecurityConstant;
import com.master.constant.MasterConstant;
import com.master.dto.ErrorCode;
import com.master.exception.BadRequestException;
import com.master.feign.FeignConstant;
import com.master.model.Account;
import com.master.model.Customer;
import com.master.model.Location;
import com.master.model.Permission;
import com.master.jwt.MasterJwt;
import com.master.repository.AccountRepository;
import com.master.repository.LocationRepository;
import com.master.service.TotpManager;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
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
@Service(value = "userService")
@Slf4j
public class UserServiceImpl implements UserDetailsService {
    public ThreadLocal<String> tenantId = new InheritableThreadLocal<>();
    @Autowired
    private AccountRepository accountRepository;
    @Value("${mfa.enabled}")
    private Boolean isMfaEnable;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TotpManager totpManager;
    @Autowired
    private LocationRepository locationRepository;

    @Override
    public UserDetails loadUserByUsername(String userId) {
        // Ignored
        return null;
    }

    public Set<GrantedAuthority> getAccountPermission(Account user) {
        List<String> roles = new ArrayList<>();
        List<Permission> permissions = user.getGroup().getPermissions();
        permissions.stream().filter(f -> f.getPermissionCode() != null).forEach(pName -> roles.add(pName.getPermissionCode()));
        return roles.stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())).collect(Collectors.toSet());
    }

    public MasterJwt getAddInfoFromToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            OAuth2AuthenticationDetails oauthDetails =
                    (OAuth2AuthenticationDetails) authentication.getDetails();
            if (oauthDetails != null) {
                Map<String, Object> map = (Map<String, Object>) oauthDetails.getDecodedDetails();
                String encodedData = (String) map.get("additional_info");
                if (encodedData != null && !encodedData.isEmpty()) {
                    return MasterJwt.decode(encodedData);
                }
                return null;
            }
        }
        return null;
    }

    public List<String> getAuthoritiesFromToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
            return authorities.stream()
                    .map(grantedAuthority -> grantedAuthority.getAuthority().replace("ROLE_", ""))
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    public String getCurrentToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (authentication instanceof AnonymousAuthenticationToken) ? null : ((OAuth2AuthenticationDetails) authentication.getDetails()).getTokenValue();
    }

    public OAuth2AccessToken getAccessTokenForMultipleTenancies(ClientDetails client, TokenRequest tokenRequest, String username, String password, String tenant, String totp, AuthorizationServerTokenServices tokenServices) throws GeneralSecurityException, IOException {
        Map<String, String> requestParameters = new HashMap<>();
        requestParameters.put("grant_type", tokenRequest.getGrantType());
        requestParameters.put("tenantId", tokenRequest.getRequestParameters().get("tenantId"));
        String clientId = client.getClientId();
        boolean approved = true;
        Set<String> responseTypes = new HashSet<>();
        responseTypes.add("code");
        Map<String, Serializable> extensionProperties = new HashMap<>();
        UserDetails userDetails = loadUserByUsername(username, password, tokenRequest.getRequestParameters());
        OAuth2Request oAuth2Request = new OAuth2Request(requestParameters, clientId,
                userDetails.getAuthorities(), approved, client.getScope(),
                client.getResourceIds(), null, responseTypes, extensionProperties);
        org.springframework.security.core.userdetails.User userPrincipal = new org.springframework.security.core.userdetails.User(userDetails.getUsername(), userDetails.getPassword(), userDetails.isEnabled(), userDetails.isAccountNonExpired(), userDetails.isCredentialsNonExpired(), userDetails.isAccountNonLocked(), userDetails.getAuthorities());
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userPrincipal, null, userDetails.getAuthorities());
        OAuth2Authentication auth = new OAuth2Authentication(oAuth2Request, authenticationToken);
        return tokenServices.createAccessToken(auth);
    }

    public UserDetails loadUserByUsername(String username, String password, Map<String, String> detailsMap) {
        String grantType = detailsMap.get("grant_type");
        String tenantId = detailsMap.get("tenantId");
        String totp = detailsMap.get("totp");
        Account user = null;
        if (SecurityConstant.GRANT_TYPE_PASSWORD.equals(grantType)) {
            user = accountRepository.findFirstByUsernameAndKind(username, MasterConstant.USER_KIND_ADMIN).orElse(null);
        } else if (SecurityConstant.GRANT_TYPE_CUSTOMER.equals(grantType)) {
            if (StringUtils.isBlank(tenantId)) {
                throw new BadRequestException("[General] tenantId is required");
            }
            user = accountRepository.findFirstByUsernameAndKind(username, MasterConstant.USER_KIND_CUSTOMER).orElse(null);
            Location location = locationRepository.findFirstByTenantId(tenantId).orElse(null);
            checkValidLocation(location);
        }
        if (user == null || !Objects.equals(MasterConstant.STATUS_ACTIVE, user.getStatus()) || !passwordEncoder.matches(password, user.getPassword())) {
            throw new BadRequestException(ErrorCode.GENERAL_ERROR_INVALID_USERNAME_OR_PASSWORD, "[General] Invalid username or password!");
        }
        boolean enabled = true;
        Set<GrantedAuthority> grantedAuthorities = getAccountPermission(user);
        if (Boolean.TRUE.equals(isMfaEnable)) {
            checkMFA(user, totp);
            if (Boolean.FALSE.equals(user.getIsMfa())) {
                user.setIsMfa(true);
                accountRepository.save(user);
            }
        }
        return new User(username, user.getPassword(), enabled, enabled, enabled, enabled, grantedAuthorities);
    }

    private void checkMFA(Account user, String totp) {
        if (totp == null) {
            throw new BadRequestException(ErrorCode.GENERAL_ERROR_TOTP_REQUIRED, "TOTP is required");
        }
        if (user.getSecretKey() == null) {
            throw new BadRequestException(ErrorCode.GENERAL_ERROR_ACCOUNT_NOT_SET_UP_2FA, "Account not setup TOTP");
        }
        boolean isVerified = totpManager.verifyCode(totp, user.getSecretKey());
        if (!isVerified) {
            throw new BadRequestException(ErrorCode.GENERAL_ERROR_VERIFY_TOTP_FAILED, "Verify TOTP failed");
        }
    }

    public String getAttributeFromToken(String attribute) {
        Map<String, Object> map = getAttributeFromToken();
        if (map != null) {
            return String.valueOf(map.get(attribute));
        }
        return null;
    }

    public Map<String, Object> getAttributeFromToken() {
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

    public String getBearerTokenHeader() {
        return FeignConstant.AUTH_BEARER_TOKEN + " " + getCurrentToken();
    }

    public void checkValidLocation(Location location) {
        if (location == null) {
            throw new BadRequestException(ErrorCode.LOCATION_ERROR_NOT_FOUND, "Location not found");
        }
        if (!MasterConstant.STATUS_ACTIVE.equals(location.getStatus())) {
            throw new BadRequestException(ErrorCode.LOCATION_ERROR_NOT_ACTIVE, "Location not active");
        }
        if (location.getExpiredDate().before(new Date())) {
            throw new BadRequestException(ErrorCode.LOCATION_ERROR_EXPIRED, "Location is expired");
        }
        Customer customer = location.getCustomer();
        if (customer == null) {
            throw new BadRequestException(ErrorCode.CUSTOMER_ERROR_NOT_FOUND, "Customer not found");
        }
        if (!MasterConstant.STATUS_ACTIVE.equals(customer.getStatus())) {
            throw new BadRequestException(ErrorCode.CUSTOMER_ERROR_NOT_ACTIVE, "Customer not active");
        }
    }
}
