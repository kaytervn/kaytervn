package com.master.validation;

import com.master.validation.impl.UserKindValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UserKindValidation.class)
@Documented
public @interface UserKind {
    boolean allowNull() default false;
    String message() default "User kind invalid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
