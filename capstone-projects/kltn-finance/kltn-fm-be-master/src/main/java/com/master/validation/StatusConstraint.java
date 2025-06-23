package com.master.validation;

import com.master.validation.impl.StatusValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = StatusValidation.class)
@Documented
public @interface StatusConstraint {
    boolean allowNull() default false;

    String message() default "Status is invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
