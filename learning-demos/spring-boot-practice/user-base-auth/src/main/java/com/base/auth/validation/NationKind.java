package com.base.auth.validation;


import com.base.auth.validation.impl.NationKindValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = NationKindValidation.class)
@Documented
public @interface NationKind {
    boolean allowNull() default false;
    String message() default  "Kind invalid.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
