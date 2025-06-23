package com.tenant.validation;

import com.tenant.validation.impl.PermissionKindValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PermissionKindValidation.class)
@Documented
public @interface PermissionKind {
    boolean allowNull() default false;

    String message() default "Permission kind is invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
