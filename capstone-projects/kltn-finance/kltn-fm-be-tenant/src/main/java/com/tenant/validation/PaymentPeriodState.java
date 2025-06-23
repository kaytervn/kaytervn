package com.tenant.validation;

import com.tenant.validation.impl.PaymentPeriodStateValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PaymentPeriodStateValidation.class)
@Documented
public @interface PaymentPeriodState {
    boolean allowNull() default false;
    String message() default "Payment period state invalid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}