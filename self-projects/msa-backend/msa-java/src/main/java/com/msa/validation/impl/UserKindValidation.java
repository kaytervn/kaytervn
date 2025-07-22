package com.msa.validation.impl;

import com.msa.constant.SecurityConstant;
import com.msa.validation.UserKind;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;

public class UserKindValidation implements ConstraintValidator<UserKind, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(UserKind constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext context) {
        return value == null ? allowNull : List.of(
                SecurityConstant.USER_KIND_ADMIN,
                SecurityConstant.USER_KIND_USER
        ).contains(value);
    }
}