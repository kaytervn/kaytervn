package com.tenant.validation;

import com.tenant.validation.impl.JsonFieldValidation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

/**
 * This annotation to validate JSON string field by deserializing it into a specified Java class
 * Usage:
 * *    @ValidJsonField(classType = YourClass.class)
 * Note:
 *      If the specified field classType contains nested objects, ensure that this nested objects is
 *      annotated with JSR-303 constraint @Valid to enable recursive validation.
 * For example:
 *      public class YourClass {
 * *        @NotBlank
 *          private String name;
 *
 * *        @Valid
 * *        @NotNull
 *          private ChildClass child;
 *      }
 *
 *      public class ChildClass {
 * *        @NotBlank
 *          private String childName;
 *      }
 */

@Documented
@Constraint(validatedBy = JsonFieldValidation.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidJsonField {
    boolean allowNull() default false;

    String message() default "Invalid json format!";

    Class<?> classType();

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}