package com.msa.validation;

import com.msa.validation.impl.AccountKindValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = AccountKindValidation.class)
@Documented
public @interface AccountKind {
    boolean allowNull() default false;

    String message() default "Account kind is invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}