package com.user_spring.exception.message;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ValidMessage {
    INVALID_KEY("Invalid error key"),
    EXISTED_FIELD("{field} existed"),
    NOT_BLANK_FIELD("{field} must not be blank"),
    INVALID_FIELD_SIZE("{field} must be at least {min} characters"),
    INVALID_ENUM("{field} must be any of {enumClass}"),
    INVALID_DOB("Your age must be at least {min}"),
    INVALID_PHONE("{field} must be 10 digits long"),
    ;
    String message;
}
