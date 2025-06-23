package com.tenant.validation.impl;

import com.tenant.constant.FinanceConstant;
import com.tenant.validation.TransactionKind;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class TransactionKindValidation implements ConstraintValidator<TransactionKind, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(TransactionKind constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer kind, ConstraintValidatorContext constraintValidatorContext) {
        if (kind == null && allowNull) {
            return true;
        }
        if (!Objects.equals(kind, FinanceConstant.TRANSACTION_KIND_INCOME) &&
                !Objects.equals(kind, FinanceConstant.TRANSACTION_KIND_EXPENDITURE)) {
            return false;
        }
        return true;
    }
}
