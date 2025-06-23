package com.tenant.validation;

import com.tenant.validation.impl.TaskStateValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TaskStateValidation.class)
@Documented
public @interface TaskState {
    boolean allowNull() default false;

    String message() default "Task state invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
