package com.msa.validation;

import com.msa.validation.impl.JsonFieldValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = JsonFieldValidation.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidJsonField {
    boolean allowNull() default false;

    String message() default "Invalid JSON format";

    int type() default -1;

    Class<?> classType();

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}