package com.user_spring.exception.message;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorMessage {
    UNCATEGORIZED_EXCEPTION("Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_FORM("Invalid form", HttpStatus.BAD_REQUEST),
    ENTITY_NOT_FOUND("{entity} not found", HttpStatus.NOT_FOUND),
    INVALID_PASSWORD("Invalid password", HttpStatus.BAD_REQUEST),
    INVALID_TOKEN("Invalid token", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED("Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED("You do not have permission", HttpStatus.FORBIDDEN),
    ;
    String message;
    HttpStatus status;
}
