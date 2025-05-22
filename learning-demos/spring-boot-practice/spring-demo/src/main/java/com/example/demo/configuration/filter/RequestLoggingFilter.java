package com.example.demo.configuration.filter;

import io.micrometer.common.util.StringUtils;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
@Slf4j
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        CachedHttpServletRequest wrappedRequest = new CachedHttpServletRequest(request);

        long startTime = System.currentTimeMillis();

        filterChain.doFilter(wrappedRequest, response);

        long endTime = System.currentTimeMillis();
        long executionTime = endTime - startTime;

        String requestPayload = new String(wrappedRequest.getCachedPayload(), request.getCharacterEncoding());
        requestPayload = StringUtils.isBlank(requestPayload) ? null : requestPayload;

        log.info("REQUEST URI: {} {}", request.getMethod(), request.getRequestURI());
        log.info("REQUEST QUERY: {}", request.getQueryString());
        log.info("REQUEST EXECUTION TIME: {} ms", executionTime);
        log.info("REQUEST PAYLOAD: {}", requestPayload);
    }
}