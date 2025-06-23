package com.master.validation;


import com.master.validation.impl.HostValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = HostValidation.class)
@Documented
public @interface HostConstraint {
    boolean allowNull() default false;

    String message() default "Host is invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
