package com.tenant.validation;

import com.tenant.validation.impl.ColorCodeValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ColorCodeValidation.class)
@Documented
public @interface ColorCodeConstraint {
    boolean allowNull() default false;

    String message() default "Color code is invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
