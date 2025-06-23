package com.tenant.validation.impl;

import com.tenant.constant.FinanceConstant;
import com.tenant.validation.PaymentPeriodState;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class PaymentPeriodStateValidation implements ConstraintValidator<PaymentPeriodState, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(PaymentPeriodState constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer kind, ConstraintValidatorContext constraintValidatorContext) {
        if (kind == null && allowNull) {
            return true;
        }
        if (!Objects.equals(kind, FinanceConstant.PAYMENT_PERIOD_STATE_CREATED) &&
                !Objects.equals(kind, FinanceConstant.PAYMENT_PERIOD_STATE_APPROVE)) {
            return false;
        }
        return true;
    }
}