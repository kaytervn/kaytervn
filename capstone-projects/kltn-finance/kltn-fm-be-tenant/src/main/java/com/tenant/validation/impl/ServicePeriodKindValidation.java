package com.tenant.validation.impl;

import com.tenant.constant.FinanceConstant;
import com.tenant.validation.ServicePeriodKind;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class ServicePeriodKindValidation implements ConstraintValidator<ServicePeriodKind, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(ServicePeriodKind constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer periodKind, ConstraintValidatorContext constraintValidatorContext) {
        if (periodKind == null && allowNull) {
            return true;
        }
        if (!Objects.equals(periodKind, FinanceConstant.SERVICE_PERIOD_KIND_FIX_DAY) &&
                !Objects.equals(periodKind, FinanceConstant.SERVICE_PERIOD_KIND_MONTH) &&
                !Objects.equals(periodKind, FinanceConstant.SERVICE_PERIOD_KIND_YEAR)) {
            return false;
        }
        return true;
    }
}
