package com.msa.config;

import com.msa.cache.SessionService;
import com.msa.dto.auth.RequestInfoDto;
import com.msa.dto.auth.UserTokenDto;
import com.msa.utils.ConvertUtils;
import com.msa.utils.GenerateUtils;
import com.msa.utils.MD5Utils;
import com.msa.utils.ZipUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
public class CustomTokenEnhancer implements TokenEnhancer {
    private final JdbcTemplate jdbcTemplate;
    private final SessionService sessionService;

    public CustomTokenEnhancer(JdbcTemplate jdbcTemplate, SessionService sessionService) {
        this.jdbcTemplate = jdbcTemplate;
        this.sessionService = sessionService;
    }

    @Override
    public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
        ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(getAdditionalInfo(authentication));
        return accessToken;
    }

    private Map<String, Object> getAdditionalInfo(OAuth2Authentication authentication) {
        RequestInfoDto info = getRequestInfoFromOAuth2Request(authentication);
        Map<String, Object> additionalInfo = new HashMap<>();
        UserTokenDto user = getUserByUsername(info.getUsername());
        if (user == null) {
            return additionalInfo;
        }
        Long accountId = user.getId();
        String secretKey = GenerateUtils.generateRandomString(16);
        Integer userKind = user.getKind();
        Boolean isSuperAdmin = user.getIsSuperAdmin();
        String grantType = info.getGrantType();
        String username = user.getUsername();
        additionalInfo.put("username", username);
        additionalInfo.put("user_id", accountId);
        additionalInfo.put("user_kind", userKind);
        additionalInfo.put("grant_type", grantType);
        String randomString = GenerateUtils.generateRandomString(6);
        Date date = new Date();
        String sessionId = MD5Utils.hash(username + date + randomString);
        String DELIM = "|";
        String additionalInfoStr = ZipUtils.zipString(accountId + DELIM
                + userKind + DELIM
                + username + DELIM
                + isSuperAdmin + DELIM
                + secretKey + DELIM
                + sessionId
        );
        additionalInfo.put("additional_info", additionalInfoStr);
        String key = sessionService.getKeyString(userKind, username);
        sessionService.sendMessageLockUser(userKind, username);
        sessionService.updateLastLogin(username);
        sessionService.putKey(key, sessionId);
        sessionService.storeSession(key, sessionId);
        return additionalInfo;
    }

    public UserTokenDto getUserByUsername(String username) {
        String query = "SELECT u.id, u.kind, u.username, u.is_super_admin " +
                "FROM db_user u WHERE u.username = ? AND u.status = 1 limit 1";
        log.debug("Executing query: {}", query);
        try {
            List<UserTokenDto> dto = jdbcTemplate.query(query, new Object[]{username}, new BeanPropertyRowMapper<>(UserTokenDto.class));
            if (!dto.isEmpty()) return dto.get(0);
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    public RequestInfoDto getRequestInfoFromOAuth2Request(OAuth2Authentication authentication) {
        Map<String, String> requestParams = authentication.getOAuth2Request().getRequestParameters();
        RequestInfoDto requestInfoDto = new RequestInfoDto();
        String grantType = requestParams.get("grant_type");
        String username = requestParams.get("username");
        Long userId = ConvertUtils.parseLong(requestParams.get("userId"), -1L);
        if (StringUtils.isNotBlank(authentication.getName())) {
            username = authentication.getName();
        }
        requestInfoDto.setGrantType(grantType);
        requestInfoDto.setUsername(username);
        requestInfoDto.setUserId(userId);
        return requestInfoDto;
    }
}
