package com.master.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.master.config.CustomTokenEnhancer;
import com.master.constant.MasterConstant;
import com.master.dto.auth.OauthClientDetailsDto;
import com.master.dto.auth.RequestInfoDto;
import com.master.exception.BadRequestException;
import com.master.form.account.LoginEmployeeForm;
import com.master.redis.CacheClientService;
import com.master.repository.PermissionRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.OAuth2Request;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenEnhancerChain;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
public class Oauth2JWTService {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private DefaultTokenServices tokenServices;
    @Value("${mfa.enabled}")
    private Boolean isMfaEnable;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private JwtAccessTokenConverter accessTokenConverter;
    @Value("${security.oauth2.client.id}")
    private String basicClientId;
    @Autowired
    private CacheClientService cacheClientService;
    @Autowired
    private PermissionRepository permissionRepository;

    public OAuth2AccessToken generateAccessToken(UserDetails userPrincipal, OauthClientDetailsDto clientDetails, RequestInfoDto requestInfoDto) {
        try {
            OAuth2Authentication authentication = convertAuthentication(userPrincipal, clientDetails, requestInfoDto);
            TokenEnhancerChain tokenEnhancerChain = new TokenEnhancerChain();
            tokenEnhancerChain.setTokenEnhancers(Arrays.asList(new CustomTokenEnhancer(jdbcTemplate, objectMapper, isMfaEnable, cacheClientService), accessTokenConverter));
            tokenServices.setTokenEnhancer(tokenEnhancerChain);
            tokenServices.setReuseRefreshToken(false);
            tokenServices.setSupportRefreshToken(true);
            tokenServices.setAccessTokenValiditySeconds(clientDetails.getAccessTokenValidInSeconds());
            tokenServices.setRefreshTokenValiditySeconds(clientDetails.getRefreshTokenValidInSeconds());
            return tokenServices.createAccessToken(authentication);
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    private OAuth2Authentication convertAuthentication(UserDetails userDetails, OauthClientDetailsDto clientDetails, RequestInfoDto info) {
        Map<String, String> requestParameters = new HashMap<>();
        requestParameters.put("grant_type", info.getGrantType());
        requestParameters.put("username", info.getUsername());
        requestParameters.put("tenantId", info.getTenantId());
        requestParameters.put("userId", info.getUserId().toString());
        Set<String> scope = new HashSet<>();
        String[] scopeArray = clientDetails.getScope().split(",");
        Collections.addAll(scope, scopeArray);
        Set<String> responseTypes = new HashSet<>();
        responseTypes.add("code");
        Map<String, Serializable> extensionProperties = new HashMap<>();
        OAuth2Request request = new OAuth2Request(requestParameters, clientDetails.getClientId(), userDetails.getAuthorities(), true, scope, null,
                null, responseTypes, extensionProperties);
        return new OAuth2Authentication(request, new UsernamePasswordAuthenticationToken(userDetails, "N/A", userDetails.getAuthorities()));
    }

    public OauthClientDetailsDto getOauthClientDetails(String clientId) {
        try {
            String query = "SELECT client_id, scope, authorized_grant_types, access_token_validity, refresh_token_validity " +
                    "FROM oauth_client_details WHERE client_id = '" + clientId + "' LIMIT 1";
            OauthClientDetailsDto oauthClientDetailsDto = jdbcTemplate.queryForObject(query,
                    (resultSet, rowNum) -> new OauthClientDetailsDto(resultSet.getString("client_id"),
                            resultSet.getString("scope"), resultSet.getString("authorized_grant_types"),
                            resultSet.getInt("access_token_validity"), resultSet.getInt("refresh_token_validity")));
            return oauthClientDetailsDto;
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    public OAuth2AccessToken getAccessTokenForEmployee(LoginEmployeeForm form) {
        RequestInfoDto info = new RequestInfoDto();
        info.setGrantType(form.getGrantType());
        info.setUserId(form.getUserId());
        info.setUsername(form.getUsername());
        info.setTenantId(form.getTenantId());
        OauthClientDetailsDto clientDetails = getOauthClientDetails(basicClientId);
        if (clientDetails == null) {
            throw new BadRequestException("[General] Not found clientId");
        }
        if (!clientDetails.getAuthorizedGrantTypes().contains(info.getGrantType())) {
            throw new BadRequestException("[General] Client not contain this grant type");
        }
        Set<GrantedAuthority> grantedAuthorities;
        List<String> pCodes = permissionRepository.findPermissionCodesByGroupKindAndIdIn(MasterConstant.USER_KIND_EMPLOYEE, form.getPermissionIds());
        grantedAuthorities = pCodes.stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())).collect(Collectors.toSet());
        boolean enabled = true;
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(form.getUsername(), "N/A", enabled, enabled, enabled, enabled, grantedAuthorities);
        return generateAccessToken(userDetails, clientDetails, info);
    }
}
