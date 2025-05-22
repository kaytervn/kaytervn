package com.example.demo.exception;

import com.example.demo.configuration.locale.MessageUtil;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.InvalidResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import java.util.*;

@ControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<?> handlingAppException(AppException exception) {
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .timestamp(new Date())
                .status(exception.getHttpStatus().value())
                .message(MessageUtil.getMessage(exception.getMessage()))
                .reasonPhrase(exception.getHttpStatus().getReasonPhrase())
                .build();
        return ResponseEntity.status(exception.getHttpStatus()).body(apiResponse);
    }

    @ExceptionHandler(value = HandlerMethodValidationException.class)
    public ResponseEntity<?> handleMethodValidationException(HandlerMethodValidationException ex) {

        List<InvalidResponse> errors = new ArrayList<>();
        ex.getAllErrors().forEach(error -> {
            String param = Optional.ofNullable(error.getArguments())
                    .filter(args -> args.length > 0)
                    .map(args -> args[0])
                    .filter(DefaultMessageSourceResolvable.class::isInstance)
                    .map(DefaultMessageSourceResolvable.class::cast)
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .orElse(null);
            String message = MessageUtil.getMessage(error.getDefaultMessage());
            errors.add(InvalidResponse.builder()
                    .field(param)
                    .message(message)
                    .build());
        });
        var apiResponse = ApiResponse.builder()
                .timestamp(new Date())
                .status(HttpStatus.BAD_REQUEST.value())
                .reasonPhrase(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(MessageUtil.getMessage("error.validation.param"))
                .data(errors)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<?> handlingValidation(MethodArgumentNotValidException exception) {
        List<InvalidResponse> errors = new ArrayList<>();
        exception.getBindingResult().getAllErrors().forEach(error -> {
            String field = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.add(InvalidResponse.builder()
                    .field(field)
                    .message(MessageUtil.getMessage(message))
                    .build());
        });
        var apiResponse = ApiResponse.builder()
                .timestamp(new Date())
                .status(HttpStatus.BAD_REQUEST.value())
                .reasonPhrase(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(MessageUtil.getMessage("error.validation"))
                .data(errors)
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<?> handlingAccessDeniedException(AccessDeniedException exception) {
        var apiResponse = ApiResponse.builder()
                .timestamp(new Date())
                .status(HttpStatus.UNAUTHORIZED.value())
                .reasonPhrase(HttpStatus.UNAUTHORIZED.getReasonPhrase())
                .message(MessageUtil.getMessage("error.access-denied"))
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiResponse);
    }

    @ExceptionHandler({RuntimeException.class})
    ResponseEntity<?> handlingGeneralException(Exception exception) {
        var apiResponse = ApiResponse.builder()
                .timestamp(new Date())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .reasonPhrase(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .message(exception.getMessage())
                .build();
        log.info("Uncategorized Exception: ", exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
    }
}
