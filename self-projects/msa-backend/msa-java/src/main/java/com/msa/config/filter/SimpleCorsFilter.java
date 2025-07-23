package com.msa.config.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.msa.constant.SecurityConstant;
import com.msa.config.filter.dto.RequestDto;
import com.msa.service.encryption.EncryptionService;
import com.msa.utils.AESUtils;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class SimpleCorsFilter extends OncePerRequestFilter {
    private final static String ALLOWED_HEADERS = String.join(",", SecurityConstant.ALLOWED_HEADERS);
    private final static String ALLOWED_METHODS = String.join(",", SecurityConstant.ALLOWED_METHODS);
    private final static String MAX_AGE = "3600";
    @Autowired
    private EncryptionService encryptionService;
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", ALLOWED_METHODS);
        response.setHeader("Access-Control-Max-Age", MAX_AGE);
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Headers", ALLOWED_HEADERS);
        response.setHeader("Access-Control-Expose-Headers", ALLOWED_HEADERS);
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            HttpServletRequest wrapper = new HttpServletRequestWrapper(request) {
                @Override
                public String getHeader(String name) {
                    String authHeader = super.getHeader(name);
                    if (SecurityConstant.HEADER_AUTHORIZATION.equalsIgnoreCase(name)) {
                        return encryptionService.getAuthHeader(authHeader);
                    }
                    return super.getHeader(name);
                }
                @Override
                public Enumeration<String> getHeaders(String name) {
                    String authHeader = super.getHeader(name);
                    if (StringUtils.isNotBlank(authHeader) && SecurityConstant.HEADER_AUTHORIZATION.equalsIgnoreCase(name)) {
                        return Collections.enumeration(List.of(encryptionService.getAuthHeader(authHeader)));
                    }
                    return super.getHeaders(name);
                }
            };
            filterChain.doFilter(decryptRequest(wrapper), response);
        }
    }

    private HttpServletRequest decryptRequest(HttpServletRequest request) {
        if (request.getContentType() == null || !MediaType.APPLICATION_JSON.includes(MediaType.valueOf(request.getContentType()))) {
            return request;
        }
        HttpServletRequest defaultRequest = new CustomBodyRequestWrapper(request, "");
        try {
            String clientRequestId = encryptionService.clientDecrypt(request.getHeader(SecurityConstant.HEADER_CLIENT_REQUEST_ID));
            CachedBodyHttpServletRequest wrappedRequest = new CachedBodyHttpServletRequest(request);
            String rawBody = new String(wrappedRequest.getCachedBody(), StandardCharsets.UTF_8);
            RequestDto requestDto = objectMapper.readValue(rawBody, RequestDto.class);
            String decryptedJson = AESUtils.decrypt(clientRequestId, requestDto.getRequest());
            if (decryptedJson != null) {
                return new CustomBodyRequestWrapper(wrappedRequest, decryptedJson);
            }
        } catch (Exception e) {
            return defaultRequest;
        }
        return defaultRequest;
    }
}
