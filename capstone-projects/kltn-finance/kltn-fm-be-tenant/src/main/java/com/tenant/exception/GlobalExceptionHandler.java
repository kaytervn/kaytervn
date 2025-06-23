/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.tenant.exception;

/**
 *
 * @author cht
 */

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ApiResponse;
import com.tenant.form.ErrorForm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ControllerAdvice
@RestController
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    private static final String BAD_REQUEST = "BAD REQUEST";
    @Autowired
    private ObjectMapper objectMapper;

    @ExceptionHandler({NotFoundException.class})
    public ResponseEntity<ApiMessageDto<String>> globalExceptionHandler(NotFoundException ex) {
        log.error(""+ex.getMessage(), ex);
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        apiMessageDto.setCode("ERROR");
        apiMessageDto.setResult(false);
        apiMessageDto.setMessage(ex.getMessage());
        return new ResponseEntity<>(apiMessageDto, HttpStatus.NOT_FOUND);
    }

    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(NoHandlerFoundException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        apiMessageDto.setCode("ERROR handleNoHandlerFoundException");
        apiMessageDto.setResult(false);
        apiMessageDto.setMessage("[Ex3]: 404");
        return new ResponseEntity<>(apiMessageDto, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({ErrorNotReadyException.class})
    public ResponseEntity<ApiMessageDto<String>> handleErrorNotReadyException(ErrorNotReadyException ex, WebRequest request) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        apiMessageDto.setCode("ERROR-NOT-READY");
        apiMessageDto.setResult(false);
        apiMessageDto.setMessage(ex.getMessage());
        return new ResponseEntity<>(apiMessageDto, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({AccessDeniedException.class})
    public ResponseEntity<ApiMessageDto<String>> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        apiMessageDto.setCode("ERROR-DENIED");
        apiMessageDto.setResult(false);
        apiMessageDto.setMessage(ex.getMessage());
        return new ResponseEntity<>(apiMessageDto, HttpStatus.OK);
    }

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(RuntimeException.class)
	@ResponseBody
	public ApiMessageDto<List<ErrorForm>> exceptionHandler(Exception ex) {
        log.error(""+ex.getMessage(), ex);
		ApiMessageDto<List<ErrorForm>> apiMessageDto = new ApiMessageDto<>();
		apiMessageDto.setCode("ERROR");
		apiMessageDto.setResult(false);
		if(ex instanceof MyBindingException){
            try {
                List<ErrorForm> errorForms = Arrays.asList(objectMapper.readValue(ex.getMessage(), ErrorForm[].class));
                apiMessageDto.setData(errorForms);
                apiMessageDto.setMessage("Invalid form");
            }catch (Exception e){
                log.error(e.getMessage());
            }
        }else{
            apiMessageDto.setMessage("[Ex2]: "+ex.getMessage());
        }
		return apiMessageDto;
	}

    @ExceptionHandler({BadRequestException.class})
    public ResponseEntity<ApiMessageDto<String>> handleBadRequestException(BadRequestException ex) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        String errorCode = ex.getCode() != null ? ex.getCode() : "ERROR-403";
        apiMessageDto.setResult(false);
        apiMessageDto.setCode(errorCode);
        apiMessageDto.setMessage(ex.getMessage());
        return new ResponseEntity<>(apiMessageDto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({UnauthorizationException.class})
    public ResponseEntity<ApiMessageDto<String>> handleUnauthorizationException(UnauthorizationException ex) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        apiMessageDto.setResult(false);
        apiMessageDto.setCode("ERROR-401");
        apiMessageDto.setMessage(ex.getMessage());
        return new ResponseEntity<>(apiMessageDto, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler({ForbiddenException.class})
    public ResponseEntity<ApiMessageDto<String>> handleForbiddenException(ForbiddenException ex) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        apiMessageDto.setResult(false);
        apiMessageDto.setCode("ERROR-403");
        apiMessageDto.setMessage(ex.getMessage());
        return new ResponseEntity<>(apiMessageDto, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({ConstraintViolationException.class})
    public ResponseEntity handleConstraintViolation(
            ConstraintViolationException ex, WebRequest request) {
        ex.printStackTrace();
        Map<String, Object> errors = new HashMap<>();
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            errors.put(violation.getPropertyPath().toString(), violation.getPropertyPath() + " | " + violation.getMessage());
        }
        return new ResponseEntity(new ApiResponse(HttpStatus.BAD_REQUEST, BAD_REQUEST, errors), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({TokenExceptionHandler.class})
    public ResponseEntity<ApiMessageDto<String>> invalidTokenHandler(TokenExceptionHandler ex, WebRequest request) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        apiMessageDto.setCode("Invalid token or token had expired!");
        apiMessageDto.setResult(false);
        apiMessageDto.setMessage(ex.getMessage());
        return new ResponseEntity<>(apiMessageDto, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(CustomizeOverallException.class)
    public ResponseEntity<ApiMessageDto<String>> handleInternalExceptionAll(CustomizeOverallException ex, WebRequest request) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        apiMessageDto.setCode("internalServerError");
        apiMessageDto.setResult(false);
        apiMessageDto.setMessage(ex.getMessage());
        return new ResponseEntity<>(apiMessageDto, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public void exceptionResponse(HttpServletResponse response, String code, String message) {
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        apiMessageDto.setCode(code);
        apiMessageDto.setResult(false);
        apiMessageDto.setMessage(message);
        try {
            response.getOutputStream().write(objectMapper.writeValueAsBytes(apiMessageDto));
            response.flushBuffer();
        } catch (Exception ignored) {}
    }
}
