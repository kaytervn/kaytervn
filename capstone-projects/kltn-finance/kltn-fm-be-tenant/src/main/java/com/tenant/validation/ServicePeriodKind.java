package com.tenant.validation;


import com.tenant.validation.impl.ServicePeriodKindValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ServicePeriodKindValidation.class)
@Documented
public @interface ServicePeriodKind {
    boolean allowNull() default false;

    String message() default "Service period kind invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
