package com.msa.config.filter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.msa.constant.SecurityConstant;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Enumeration;
import java.util.Map;
import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@Slf4j
public class JsonToUrlEncodedAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        if (isJsonTokenRequest(request)) {
            try {
                byte[] json = request.getInputStream().readAllBytes();
                Map<String, String[]> parameters = parseJsonToParameters(json);
                HttpServletRequest requestWrapper = new RequestWrapper(request, parameters);
                filterChain.doFilter(requestWrapper, response);
            } catch (Exception e) {
                filterChain.doFilter(request, response);
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }

    private boolean isJsonTokenRequest(HttpServletRequest request) {
        String contentType = request.getContentType();
        return SecurityConstant.REQUEST_TOKEN_PATH.equals(request.getServletPath()) && contentType != null && contentType.contains("application/json");
    }

    private Map<String, String[]> parseJsonToParameters(byte[] json) throws IOException {
        return new ObjectMapper().readValue(json, new TypeReference<Map<String, String>>() {
        }).entrySet().stream().collect(Collectors.toMap(Map.Entry::getKey, e -> new String[]{e.getValue()}));
    }

    private static class RequestWrapper extends HttpServletRequestWrapper {
        private final Map<String, String[]> params;

        RequestWrapper(HttpServletRequest request, Map<String, String[]> params) {
            super(request);
            this.params = params;
        }

        @Override
        public String getParameter(String name) {
            return Optional.ofNullable(this.params.get(name)).map(values -> values[0]).orElse(null);
        }

        @Override
        public Map<String, String[]> getParameterMap() {
            return Collections.unmodifiableMap(this.params);
        }

        @Override
        public Enumeration<String> getParameterNames() {
            return Collections.enumeration(params.keySet());
        }

        @Override
        public String[] getParameterValues(String name) {
            return this.params.get(name);
        }
    }
}
