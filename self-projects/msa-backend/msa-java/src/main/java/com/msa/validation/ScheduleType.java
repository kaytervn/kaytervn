package com.msa.validation;

import com.msa.validation.impl.ScheduleTypeValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ScheduleTypeValidation.class)
@Documented
public @interface ScheduleType {
    boolean allowNull() default false;

    String message() default "Schedule type is invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}