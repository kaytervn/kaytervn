package com.master.validation;


import com.master.validation.impl.NameValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = NameValidation.class)
@Documented
public @interface NameConstraint {
    boolean allowNull() default false;

    String message() default "Name is invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
