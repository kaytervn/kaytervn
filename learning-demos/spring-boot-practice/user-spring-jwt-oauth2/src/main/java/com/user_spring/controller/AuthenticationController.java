package com.user_spring.controller;

import com.nimbusds.jose.JOSEException;
import com.user_spring.dto.request.AuthenticationRequest;
import com.user_spring.dto.request.IntrospectRequest;
import com.user_spring.dto.response.ApiResponse;
import com.user_spring.dto.response.AuthenticationResponse;
import com.user_spring.service.AuthenticationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Authentication Controller")
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/token")
    ApiResponse<?> authenticate(@Valid @RequestBody AuthenticationRequest request) throws JOSEException {
        AuthenticationResponse response = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .status(HttpStatus.ACCEPTED.value())
                .message("User logged in successfully")
                .data(response)
                .build();
    }

    @PostMapping("/introspect")
    ApiResponse<?> introspect(@Valid @RequestBody IntrospectRequest request) throws JOSEException, ParseException {
        authenticationService.introspect(request);
        return ApiResponse.builder()
                .status(HttpStatus.ACCEPTED.value())
                .message("Token verified successfully")
                .build();
    }
}
