package com.tenant.validation;

import com.tenant.validation.impl.IgnoreDebitValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = IgnoreDebitValidation.class)
@Documented
public @interface IgnoreDebit {
    boolean allowNull() default true;
    String message() default "Ignore debit is invalid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
