package com.tenant.validation;

import com.tenant.validation.impl.TransactionKindValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TransactionKindValidation.class)
@Documented
public @interface TransactionKind {
    boolean allowNull() default false;
    String message() default "Transaction kind invalid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
