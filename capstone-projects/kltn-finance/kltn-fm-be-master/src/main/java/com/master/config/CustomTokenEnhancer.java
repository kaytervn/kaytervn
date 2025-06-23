package com.master.config;

import com.master.constant.MasterConstant;
import com.master.dto.auth.RequestInfoDto;
import com.master.redis.RedisConstant;
import com.master.redis.CacheClientService;
import com.master.redis.dto.SessionRequestForm;
import com.master.utils.DateUtils;
import com.master.utils.GenerateUtils;
import com.master.utils.Md5Utils;
import com.master.utils.ZipUtils;
import com.master.dto.auth.AccountForTokenDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;

import java.util.*;

@Slf4j
public class CustomTokenEnhancer implements TokenEnhancer {
    private final static String EMPTY_STRING = "<>";
    private JdbcTemplate jdbcTemplate;
    private ObjectMapper objectMapper;
    private Boolean isMfaEnable;
    private CacheClientService cacheClientService;

    public CustomTokenEnhancer(JdbcTemplate jdbcTemplate, ObjectMapper objectMapper, Boolean isMfaEnable, CacheClientService cacheClientService) {
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
        this.isMfaEnable = isMfaEnable;
        this.cacheClientService = cacheClientService;
    }

    @Override
    public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
        ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(getAdditionalInfo(authentication));
        return accessToken;
    }

    private Map<String, Object> getAdditionalInfo(OAuth2Authentication authentication) {
        RequestInfoDto info = getRequestInfoFromOAuth2Request(authentication);
        Map<String, Object> additionalInfo = new HashMap<>();
        AccountForTokenDto a;
        if (List.of(
                SecurityConstant.GRANT_TYPE_EMPLOYEE,
                SecurityConstant.GRANT_TYPE_MOBILE
        ).contains(info.getGrantType())) {
            a = getAccountEmployee(info);
        } else {
            a = getAccountByUsername(info.getUsername());
        }

        if (a == null) {
            return additionalInfo;
        }

        Long accountId = a.getId();
        String secretKey = GenerateUtils.generateRandomString(16);
        Integer userKind = a.getKind();
        Boolean isSuperAdmin = a.getIsSuperAdmin();
        String grantType = info.getGrantType();
        String tenantName = info.getTenantId();
        String username = a.getUsername();

        additionalInfo.put("username", username);
        additionalInfo.put("user_id", accountId);
        additionalInfo.put("user_kind", userKind);
        additionalInfo.put("grant_type", grantType);
        if (StringUtils.isNotBlank(tenantName) && !EMPTY_STRING.equals(tenantName)) {
            additionalInfo.put("tenant_name", tenantName);
        }

        String DELIM = "|";
        String additionalInfoStr = ZipUtils.zipString(accountId + DELIM
                + userKind + DELIM
                + username + DELIM
                + isSuperAdmin + DELIM
                + secretKey + DELIM
                + tenantName);
        additionalInfo.put("additional_info", additionalInfoStr);
        String randomString = GenerateUtils.generateRandomString(6);
        Date date = new Date();
        String sessionId = Md5Utils.hash(username + date + randomString);
        additionalInfo.put("session_id", sessionId);
        // Set session for device
        SessionRequestForm sessionRequestForm = new SessionRequestForm();
        sessionRequestForm.setSession(sessionId);
        sessionRequestForm.setTime(DateUtils.formatDate(date));
        String key;
        Integer keyType;
        Map<String, Integer> keyTypeMap = Map.of(
                SecurityConstant.GRANT_TYPE_PASSWORD, RedisConstant.KEY_ADMIN,
                SecurityConstant.GRANT_TYPE_CUSTOMER, RedisConstant.KEY_CUSTOMER,
                SecurityConstant.GRANT_TYPE_EMPLOYEE, RedisConstant.KEY_EMPLOYEE,
                SecurityConstant.GRANT_TYPE_MOBILE, RedisConstant.KEY_MOBILE
        );
        keyType = keyTypeMap.getOrDefault(grantType, RedisConstant.KEY_MOBILE);
        key = cacheClientService.getKeyString(keyType, username, tenantName);
        cacheClientService.sendMessageLockAccount(keyType, username, userKind, tenantName);
        cacheClientService.putKeyCache(key, sessionId);
        return additionalInfo;
    }

    public AccountForTokenDto getAccountByUsername(String username) {
        String query = "SELECT a.id, a.kind, a.username, a.is_super_admin " +
                "FROM db_mst_account a WHERE a.username = ? AND a.status = 1 limit 1";
        log.debug("Executing query: {}", query);
        try {
            List<AccountForTokenDto> dto = jdbcTemplate.query(query, new Object[]{username}, new BeanPropertyRowMapper<>(AccountForTokenDto.class));
            if (!dto.isEmpty()) return dto.get(0);
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    public AccountForTokenDto getAccountEmployee(RequestInfoDto info) {
        AccountForTokenDto accountForTokenDto = new AccountForTokenDto();
        accountForTokenDto.setId(info.getUserId());
        accountForTokenDto.setUsername(info.getUsername());
        accountForTokenDto.setKind(MasterConstant.USER_KIND_EMPLOYEE);
        accountForTokenDto.setIsSuperAdmin(false);
        return accountForTokenDto;
    }

    public RequestInfoDto getRequestInfoFromOAuth2Request(OAuth2Authentication authentication) {
        Map<String, String> requestParams = authentication.getOAuth2Request().getRequestParameters();
        RequestInfoDto requestInfoDto = new RequestInfoDto();
        String grantType = requestParams.get("grant_type");
        String username = requestParams.get("username");
        Long userId = null;
        try {
            userId = Long.parseLong(requestParams.get("userId"));
        } catch (Exception ignored) {
        }
        if (StringUtils.isNotBlank(authentication.getName())) {
            username = authentication.getName();
        }
        String tenantId = EMPTY_STRING;
        if (!SecurityConstant.GRANT_TYPE_PASSWORD.equals(grantType) && StringUtils.isNotBlank(requestParams.get("tenantId"))) {
            tenantId = requestParams.get("tenantId");
        }
        requestInfoDto.setTenantId(tenantId);
        requestInfoDto.setGrantType(grantType);
        requestInfoDto.setUsername(username);
        requestInfoDto.setUserId(userId);
        return requestInfoDto;
    }
}
