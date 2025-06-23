package com.tenant.validation;

import com.tenant.validation.impl.TransactionStateValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TransactionStateValidation.class)
@Documented
public @interface TransactionState {
    boolean allowNull() default false;
    String message() default "Transaction state invalid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
