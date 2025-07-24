package com.msa.validation;

import com.msa.validation.impl.TagKindValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TagKindValidation.class)
@Documented
public @interface TagKind {
    boolean allowNull() default false;

    String message() default "Tag kind is invalid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}