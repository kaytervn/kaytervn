package com.master.validation;

import com.master.validation.impl.SchemaValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = SchemaValidation.class)
@Documented
public @interface SchemaConstraint {
    boolean allowNull() default false;

    String message() default "Schema is invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
