package com.msa.component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.msa.cache.SessionService;
import com.msa.constant.ErrorCode;
import com.msa.constant.SecurityConstant;
import com.msa.dto.ApiMessageDto;
import com.msa.config.filter.dto.AuthHeaderDto;
import com.msa.config.filter.dto.ResponseDto;
import com.msa.jwt.AppJwt;
import com.msa.multitenancy.TenantDBContext;
import com.msa.service.encryption.EncryptionService;
import com.msa.service.encryption.HttpService;
import com.msa.service.impl.UserServiceImpl;
import com.msa.utils.JSONUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import lombok.NonNull;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Slf4j
public class LogInterceptor implements HandlerInterceptor {
    @Autowired
    @Lazy
    private ObjectMapper objectMapper;
    @Autowired
    private UserServiceImpl userService;
    @Autowired
    @Lazy
    private SessionService sessionService;
    @Autowired
    private HttpService httpService;
    @Autowired
    @Lazy
    private EncryptionService encryptionService;

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) throws IOException {
        AuthHeaderDto headers = httpService.extractHeaders(request);
        if (!httpService.validateDomain(headers)) {
            return handleUnauthorized(response, ErrorCode.GENERAL_ERROR_INVALID_DOMAIN, "Untrusted source");
        }
        AppJwt jwt = userService.getAddInfoFromToken();
        if (!httpService.validateSignature(headers, jwt)) {
            return handleUnauthorized(response, ErrorCode.GENERAL_ERROR_INVALID_SIGNATURE, "Invalid message signature");
        }
        if (!isValidSession(jwt)) {
            return handleUnauthorized(response, ErrorCode.GENERAL_ERROR_INVALID_SESSION, "Invalid session");
        }
        String tenantName = encryptionService.clientDecryptIgnoreNonce(request.getHeader(SecurityConstant.HEADER_X_TENANT));
        if (jwt != null) {
            TenantDBContext.setCurrentTenant(SecurityConstant.DB_USER_PREFIX + jwt.getUsername());
        } else if (StringUtils.isNotBlank(tenantName)) {
            TenantDBContext.setCurrentTenant(tenantName);
        }
        return true;
    }

    @Override
    public void afterCompletion(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler, Exception ex) throws Exception {
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }

    private boolean handleUnauthorized(HttpServletResponse response, String code, String message) throws IOException {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        apiMessageDto.setMessage(message);
        apiMessageDto.setCode(code);
        apiMessageDto.setResult(false);
        ResponseDto responseDto = new ResponseDto();
        responseDto.setResponse(encryptionService.clientEncryptInjectNonce(JSONUtils.convertObjectToJson(apiMessageDto)));
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getOutputStream().write(objectMapper.writeValueAsBytes(responseDto));
        response.flushBuffer();
        return false;
    }

    public Boolean isValidSession(AppJwt jwt) {
        if (jwt == null) {
            return true;
        }
        String key = sessionService.getKeyString(jwt.getUserKind(), jwt.getUsername());
        return sessionService.isValidSession(key, jwt.getSessionId());
    }
}
