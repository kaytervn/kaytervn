package com.master.component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.master.config.SecurityConstant;
import com.master.dto.ApiMessageDto;
import com.master.dto.ErrorCode;
import com.master.redis.RedisConstant;
import com.master.redis.CacheClientService;
import com.master.service.HttpService;
import com.master.service.impl.UserServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class LogInterceptor implements HandlerInterceptor {
    @Autowired
    private HttpService httpService;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserServiceImpl userService;
    @Autowired
    private CacheClientService cacheClientService;
    private static final List<String> INTERNAL_REQUEST = List.of(
            "/v1/db-config/get-by-name",
            "/v1/group/employee",
            "/v1/account/login-employee"
    );
    static final List<String> WHITE_LIST = List.of(
            "/v1/account/profile"
    );

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        if (isAllowed(request, INTERNAL_REQUEST) && !httpService.checkInternalRequest(request)) {
            return handleUnauthorized(response, ErrorCode.GENERAL_ERROR_INVALID_API_KEY, "Full authentication is required to access this resource");
        }
        if (isAllowed(request, WHITE_LIST) && !isValidSession()) {
            return handleUnauthorized(response, ErrorCode.GENERAL_ERROR_INVALID_SESSION, "Invalid session");
        }
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }

    private boolean isAllowed(HttpServletRequest request, List<String> whiteList) {
        AntPathMatcher pathMatcher = new AntPathMatcher();
        return whiteList.stream().anyMatch(pattern -> pathMatcher.match(pattern, request.getRequestURI()));
    }

    private boolean handleUnauthorized(HttpServletResponse response, String code, String message) throws IOException {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        apiMessageDto.setCode(code);
        apiMessageDto.setMessage(message);
        apiMessageDto.setResult(false);
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getOutputStream().write(objectMapper.writeValueAsBytes(apiMessageDto));
        response.flushBuffer();
        return false;
    }

    public Boolean isValidSession() {
        Map<String, Object> attributes = userService.getAttributeFromToken();
        if (attributes == null || attributes.isEmpty()) {
            return true;
        }
        String username = String.valueOf(attributes.get("username"));
        String grantType = String.valueOf(attributes.get("grant_type"));
        String sessionId = String.valueOf(attributes.get("session_id"));
        String tenantName = String.valueOf(attributes.get("tenant_name"));
        String key = "";
        if (SecurityConstant.GRANT_TYPE_EMPLOYEE.equals(grantType)) {
            key = cacheClientService.getKeyString(RedisConstant.KEY_EMPLOYEE, username, tenantName);
        } else if (SecurityConstant.GRANT_TYPE_CUSTOMER.equals(grantType)) {
            key = cacheClientService.getKeyString(RedisConstant.KEY_CUSTOMER, username, tenantName);
        } else if (SecurityConstant.GRANT_TYPE_PASSWORD.equals(grantType)) {
            key = cacheClientService.getKeyString(RedisConstant.KEY_ADMIN, username, null);
        } else {
            key = cacheClientService.getKeyString(RedisConstant.KEY_MOBILE, username, tenantName);
        }
        return cacheClientService.checkSession(key, sessionId);
    }
}
