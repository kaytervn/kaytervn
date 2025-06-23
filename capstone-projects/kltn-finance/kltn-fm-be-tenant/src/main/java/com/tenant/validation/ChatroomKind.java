package com.tenant.validation;
import com.tenant.validation.impl.ChatroomKindValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ChatroomKindValidation.class)
@Documented
public @interface ChatroomKind {
    boolean allowNull() default false;
    String message() default "Chatroom kind is invalid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}