package com.tenant.validation.impl;

import com.tenant.constant.FinanceConstant;
import com.tenant.validation.TransactionState;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class TransactionStateValidation implements ConstraintValidator<TransactionState, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(TransactionState constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer state, ConstraintValidatorContext constraintValidatorContext) {
        if (state == null && allowNull) {
            return true;
        }
        if (!Objects.equals(state, FinanceConstant.TRANSACTION_STATE_CREATED) &&
                !Objects.equals(state, FinanceConstant.TRANSACTION_STATE_APPROVE) &&
                !Objects.equals(state, FinanceConstant.TRANSACTION_STATE_PAID)) {
            return false;
        }
        return true;
    }
}
