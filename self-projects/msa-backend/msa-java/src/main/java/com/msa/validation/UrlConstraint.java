package com.msa.validation;

import com.msa.validation.impl.UrlValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UrlValidation.class)
@Documented
public @interface UrlConstraint {
    boolean allowNull() default true;

    String message() default "Url is invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
