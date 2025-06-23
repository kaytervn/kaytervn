package com.tenant.component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tenant.cache.CacheClientService;
import com.tenant.cache.CacheConstant;
import com.tenant.constant.FinanceConstant;
import com.tenant.constant.SecurityConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.jwt.FinanceJwt;
import com.tenant.multitenancy.tenant.TenantDBContext;
import com.tenant.service.HttpService;
import com.tenant.service.impl.UserServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentMap;

@Component
@Slf4j
public class LogInterceptor implements HandlerInterceptor {
    @Autowired
    private UserServiceImpl userService;
    @Autowired
    private HttpService httpService;
    @Autowired
    @Qualifier("applicationConfig")
    ConcurrentMap<String, String> concurrentMap;
    @Autowired
    @Lazy
    private ObjectMapper objectMapper;
    @Autowired
    private CacheClientService cacheClientService;
    private static final List<String> ALLOWED_URLS = Arrays.asList(
            "/v1/account/**", "/v1/group/**", "/v1/department/**", "/v1/notification/**", "/v1/face-id/**"
    );
    private static final List<String> NOT_ALLOWED_URLS = List.of(
            "/v1/account/my-key"
    );
    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    private static final List<String> INTERNAL_REQUEST = List.of(
            "/v1/account/input-key",
            "/v1/account/clear-key"
    );
    static final List<String> WHITE_LIST = List.of(
            "/v1/account/profile"
    );

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        if (!isUrlAllowed(request.getRequestURI()) && StringUtils.isBlank(concurrentMap.get(FinanceConstant.PRIVATE_KEY))) {
            return handleUnauthorized(response, ErrorCode.GENERAL_ERROR_SYSTEM_NOT_READY, "Not ready");
        }
        if (isAllowed(request, WHITE_LIST) && !isValidSession()) {
            return handleUnauthorized(response, ErrorCode.GENERAL_ERROR_INVALID_SESSION, "Invalid session");
        }
        if (isAllowed(request, INTERNAL_REQUEST) && !httpService.validateInternalRequest(request)) {
            return handleUnauthorized(response, ErrorCode.GENERAL_ERROR_INVALID_API_KEY, "Invalid api key");
        }
        String tenantName = request.getHeader("X-tenant");
        FinanceJwt financeJwt = userService.getAddInfoFromToken();
        if (financeJwt != null) {
            TenantDBContext.setCurrentTenant(financeJwt.getTenantName());
        } else {
            TenantDBContext.setCurrentTenant(tenantName);
        }
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }

    private boolean isUrlAllowed(String url) {
        if (NOT_ALLOWED_URLS.contains(url)) {
            return false;
        }
        return ALLOWED_URLS.stream().anyMatch(pattern -> pathMatcher.match(pattern, url));
    }

    private boolean isAllowed(HttpServletRequest request, List<String> whiteList) {
        AntPathMatcher pathMatcher = new AntPathMatcher();
        return whiteList.stream().anyMatch(pattern -> pathMatcher.match(pattern, request.getRequestURI()));
    }

    private boolean handleUnauthorized(HttpServletResponse response, String code, String message) throws IOException {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        apiMessageDto.setMessage(message);
        apiMessageDto.setCode(code);
        apiMessageDto.setResult(false);
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getOutputStream().write(objectMapper.writeValueAsBytes(apiMessageDto));
        response.flushBuffer();
        return false;
    }

    public Boolean isValidSession() {
        Map<String, Object> attributes = userService.getAttributesFromToken();
        if (attributes == null || attributes.isEmpty()) {
            return true;
        }
        String username = String.valueOf(attributes.get("username"));
        String grantType = String.valueOf(attributes.get("grant_type"));
        String sessionId = String.valueOf(attributes.get("session_id"));
        String tenantName = String.valueOf(attributes.get("tenant_name"));
        String key = "";
        if (SecurityConstant.GRANT_TYPE_EMPLOYEE.equals(grantType)) {
            key = cacheClientService.getKeyString(CacheConstant.KEY_EMPLOYEE, username, tenantName);
        } else if (SecurityConstant.GRANT_TYPE_CUSTOMER.equals(grantType)) {
            key = cacheClientService.getKeyString(CacheConstant.KEY_CUSTOMER, username, tenantName);
        } else if (SecurityConstant.GRANT_TYPE_MOBILE.equals(grantType)) {
            key = cacheClientService.getKeyString(CacheConstant.KEY_MOBILE, username, tenantName);
        } else {
            return false;
        }
        return cacheClientService.checkSession(key, sessionId);
    }
}
