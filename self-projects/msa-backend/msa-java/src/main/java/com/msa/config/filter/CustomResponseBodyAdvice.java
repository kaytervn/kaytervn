package com.msa.config.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.msa.config.filter.dto.ResponseDto;
import com.msa.service.encryption.EncryptionService;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@RestControllerAdvice
@Slf4j
public class CustomResponseBodyAdvice implements ResponseBodyAdvice<Object> {
    @Autowired
    private EncryptionService encryptionService;
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public boolean supports(@NonNull MethodParameter returnType, @NonNull Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, @NonNull MethodParameter returnType, @NonNull MediaType selectedContentType, @NonNull Class<? extends HttpMessageConverter<?>> selectedConverterType, @NonNull ServerHttpRequest request, @NonNull ServerHttpResponse response) {
        if (body == null) {
            return null;
        }
        if (!MediaType.APPLICATION_JSON.includes(selectedContentType)) {
            return body;
        }
        try {
            String rawJson = objectMapper.writeValueAsString(body);
            String encrypted = encryptionService.clientEncrypt(rawJson);
            ResponseDto responseDto = new ResponseDto();
            responseDto.setResponse(encrypted);
            return responseDto;
        } catch (Exception e) {
            return null;
        }
    }
}