package com.user_spring.validator;

import com.user_spring.validator.impl.DobValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD})
@Retention(RUNTIME)
@Constraint(validatedBy = {DobValidator.class})
public @interface DobConstraint {
    String message() default "INVALID_DOB";

    int min();

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
