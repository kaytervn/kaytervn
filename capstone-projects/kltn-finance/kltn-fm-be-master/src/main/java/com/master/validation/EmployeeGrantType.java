package com.master.validation;

import com.master.validation.impl.EmployeeGrantTypeValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = EmployeeGrantTypeValidation.class)
@Documented
public @interface EmployeeGrantType {
    boolean allowNull() default false;
    String message() default "Grant type is invalid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}