package com.tenant.validation.impl;

import com.tenant.constant.FinanceConstant;
import com.tenant.validation.PermissionKind;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class PermissionKindValidation implements ConstraintValidator<PermissionKind, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(PermissionKind constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext constraintValidatorContext) {
        if (value == null && allowNull) {
            return true;
        }
        if (!Objects.equals(value, FinanceConstant.PERMISSION_KIND_ITEM) &&
                !Objects.equals(value, FinanceConstant.PERMISSION_KIND_GROUP)) {
            return false;
        }
        return true;
    }
}