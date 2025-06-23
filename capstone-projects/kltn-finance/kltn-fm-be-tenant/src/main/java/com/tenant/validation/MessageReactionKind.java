package com.tenant.validation;

import com.tenant.validation.impl.EmailValidation;
import com.tenant.validation.impl.MessageReactionKindValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MessageReactionKindValidation.class)
@Documented
public @interface MessageReactionKind {
    boolean allowNull() default false;

    String message() default "Message reaction kind is invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
