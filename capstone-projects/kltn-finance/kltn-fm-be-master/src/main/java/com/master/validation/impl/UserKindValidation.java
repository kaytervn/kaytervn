package com.master.validation.impl;

import com.master.constant.MasterConstant;
import com.master.validation.UserKind;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class UserKindValidation implements ConstraintValidator<UserKind, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(UserKind constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext constraintValidatorContext) {
        if (value == null && allowNull) {
            return true;
        }
        if (!Objects.equals(value, MasterConstant.USER_KIND_ADMIN) &&
                !Objects.equals(value, MasterConstant.USER_KIND_CUSTOMER)) {
            return false;
        }
        return true;
    }
}
