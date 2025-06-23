package com.tenant.validation;

import com.tenant.validation.impl.ServiceKindValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ServiceKindValidation.class)
@Documented
public @interface ServiceKind {
    boolean allowNull() default false;
    String message() default "Service kind invalid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
