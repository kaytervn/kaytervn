package com.tenant.validation.impl;

import com.tenant.constant.FinanceConstant;
import com.tenant.validation.IgnoreDebit;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class IgnoreDebitValidation implements ConstraintValidator<IgnoreDebit, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(IgnoreDebit constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer state, ConstraintValidatorContext constraintValidatorContext) {
        if (state == null && allowNull) {
            return true;
        }
        if (!Objects.equals(state, FinanceConstant.IGNORE_ENTITY_RELATIONSHIP_TRUE) &&
                !Objects.equals(state, FinanceConstant.IGNORE_ENTITY_RELATIONSHIP_FALSE)) {
            return false;
        }
        return true;
    }
}
