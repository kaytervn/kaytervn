package com.user_spring.validator.impl;

import com.user_spring.validator.EnumConstraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

public class EnumValidator implements ConstraintValidator<EnumConstraint, String> {
    private List<String> acceptedValues;

    @Override
    public void initialize(EnumConstraint constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
        acceptedValues = Stream.of(constraintAnnotation.enumClass().getEnumConstants()).map(Enum::name).toList();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (Objects.isNull(value))
            return false;
        return acceptedValues.contains(value.toUpperCase());
    }
}
