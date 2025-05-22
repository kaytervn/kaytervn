package com.user_spring.exception;

import com.nimbusds.jose.JOSEException;
import com.user_spring.dto.response.ApiResponse;
import com.user_spring.dto.response.ValidResponse;
import com.user_spring.exception.message.ErrorMessage;
import com.user_spring.exception.message.ValidMessage;
import com.user_spring.enums.Gender;
import jakarta.validation.ConstraintViolation;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.text.ParseException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final String MIN_ATTRIBUTE = "min";
    private static final String FIELD_NAME = "field";
    private static final String ENUM_CLASS_ATTRIBUTE = "enumClass";
    private static final String ENTITY_CLASS = "entity";

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<?> handlingAppException(AppException exception) {
        ErrorMessage errorMessage = exception.getErrorMessage();
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setStatus(errorMessage.getStatus().value());
        String message = errorMessage.getMessage();
        if (Objects.nonNull(exception.getEntity())) {
            message = message.replace("{" + ENTITY_CLASS + "}", exception.getEntity().getSimpleName());
        }
        apiResponse.setMessage(message);
        return ResponseEntity.status(errorMessage.getStatus()).body(apiResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<?> handlingValidation(MethodArgumentNotValidException exception) {
        ErrorMessage errorMessage = ErrorMessage.INVALID_FORM;
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage(errorMessage.getMessage());
        apiResponse.setStatus(errorMessage.getStatus().value());
        List<ValidResponse> errors = new ArrayList<>();
        exception.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String enumKey = error.getDefaultMessage();
            ValidMessage validMessage = ValidMessage.INVALID_KEY;
            try {
                validMessage = ValidMessage.valueOf(enumKey);
                Map attributes = error
                        .unwrap(ConstraintViolation.class)
                        .getConstraintDescriptor()
                        .getAttributes();
                String message = mapAttribute(validMessage.getMessage(), attributes, fieldName);
                errors.add(new ValidResponse(fieldName, message));
            } catch (IllegalArgumentException ex) {
                System.out.println(ex.getMessage());
            }
        });
        apiResponse.setData(errors);
        return ResponseEntity.status(errorMessage.getStatus()).body(apiResponse);
    }

    private String mapAttribute(String message, Map<String, Object> attributes, String field) {
        String minValue = String.valueOf(attributes.get(MIN_ATTRIBUTE));
        String enumClass = String.valueOf(attributes.get(ENUM_CLASS_ATTRIBUTE));
        String acceptedValuesString = "[" + Stream.of(Gender.values()).map(Enum::name).collect(Collectors.joining(", ")) + "]";

        return message
                .replace("{" + MIN_ATTRIBUTE + "}", minValue)
                .replace("{" + FIELD_NAME + "}", field)
                .replace("{" + ENUM_CLASS_ATTRIBUTE + "}", acceptedValuesString);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<?> handlingAccessDeniedException(AccessDeniedException exception) {
        ErrorMessage errorMessage = ErrorMessage.UNAUTHORIZED;
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setStatus(errorMessage.getStatus().value());
        apiResponse.setMessage(errorMessage.getMessage());
        return ResponseEntity.status(errorMessage.getStatus()).body(apiResponse);
    }

    @ExceptionHandler({
            ParseException.class,
            RuntimeException.class,
            JOSEException.class,
    })
    ResponseEntity<?> handlingGeneralException(Exception exception) {
        ErrorMessage errorMessage = ErrorMessage.UNCATEGORIZED_EXCEPTION;
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setStatus(errorMessage.getStatus().value());
        apiResponse.setMessage(exception.getMessage());
        return ResponseEntity.status(errorMessage.getStatus()).body(apiResponse);
    }
}
