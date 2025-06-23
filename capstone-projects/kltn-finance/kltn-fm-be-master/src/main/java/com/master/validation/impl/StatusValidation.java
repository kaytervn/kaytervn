package com.master.validation.impl;

import com.master.constant.MasterConstant;
import com.master.validation.StatusConstraint;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class StatusValidation implements ConstraintValidator<StatusConstraint, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(StatusConstraint constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext constraintValidatorContext) {
        if (value == null && allowNull) {
            return true;
        }
        if (!Objects.equals(value, MasterConstant.STATUS_ACTIVE) &&
                !Objects.equals(value, MasterConstant.STATUS_PENDING) &&
                !Objects.equals(value, MasterConstant.STATUS_LOCK)) {
            return false;
        }
        return true;
    }
}