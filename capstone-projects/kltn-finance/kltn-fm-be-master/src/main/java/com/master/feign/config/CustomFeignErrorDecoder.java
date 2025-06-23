package com.master.feign.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.master.exception.BadRequestException;
import com.master.feign.dto.LoginErrorDto;
import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

@Component
@Slf4j
public class CustomFeignErrorDecoder implements ErrorDecoder {
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public Exception decode(String methodKey, Response response) {
        try (InputStream inputStream = response.body().asInputStream();
             BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            StringBuilder responseBody = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                responseBody.append(line);
            }
            LoginErrorDto errorResponse = objectMapper.readValue(responseBody.toString(), LoginErrorDto.class);
            String code = errorResponse.getErrorCode() != null ? errorResponse.getErrorCode() : errorResponse.getCode();
            return new BadRequestException(code, errorResponse.getMessage());
        } catch (Exception e) {
            return new BadRequestException("[Feign] Unexpected exception: " + e.getMessage());
        }
    }
}