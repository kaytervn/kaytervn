package com.master.validation;


import com.master.validation.impl.PortValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PortValidation.class)
@Documented
public @interface PortConstraint {
    boolean allowNull() default false;

    String message() default "Port is invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}