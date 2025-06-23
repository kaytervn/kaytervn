package com.master.validation.impl;

import com.master.constant.MasterConstant;
import com.master.validation.PermissionKind;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;

public class PermissionKindValidation implements ConstraintValidator<PermissionKind, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(PermissionKind constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext context) {
        return value == null ? allowNull : List.of(
                MasterConstant.USER_KIND_ADMIN,
                MasterConstant.USER_KIND_CUSTOMER,
                MasterConstant.USER_KIND_EMPLOYEE
        ).contains(value);
    }
}
