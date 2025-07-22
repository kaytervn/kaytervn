package com.msa.validation.impl;

import com.msa.constant.AppConstant;
import com.msa.validation.StatusConstraint;

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
        return Objects.equals(value, AppConstant.STATUS_ACTIVE) ||
                Objects.equals(value, AppConstant.STATUS_PENDING) ||
                Objects.equals(value, AppConstant.STATUS_LOCK);
    }
}