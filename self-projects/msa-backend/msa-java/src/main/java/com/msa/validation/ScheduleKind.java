package com.msa.validation;

import com.msa.validation.impl.ScheduleKindValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ScheduleKindValidation.class)
@Documented
public @interface ScheduleKind {
    boolean allowNull() default false;

    String message() default "Schedule kind is invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
