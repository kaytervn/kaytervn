package com.msa.validation;

import com.msa.constant.AppConstant;
import com.msa.validation.impl.PatternValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PatternValidation.class)
@Documented
public @interface PatternConstraint {
    String pattern() default AppConstant.USERNAME_PATTERN;

    boolean allowNull() default false;

    String message() default "Invalid value";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
