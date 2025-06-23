package com.tenant.validation.impl;

import com.tenant.constant.FinanceConstant;
import com.tenant.validation.ServiceKind;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class ServiceKindValidation implements ConstraintValidator<ServiceKind, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(ServiceKind constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer kind, ConstraintValidatorContext constraintValidatorContext) {
        if (kind == null && allowNull) {
            return true;
        }
        if (!Objects.equals(kind, FinanceConstant.SERVICE_KIND_INCOME) &&
                !Objects.equals(kind, FinanceConstant.SERVICE_KIND_EXPENDITURE)) {
            return false;
        }
        return true;
    }
}
