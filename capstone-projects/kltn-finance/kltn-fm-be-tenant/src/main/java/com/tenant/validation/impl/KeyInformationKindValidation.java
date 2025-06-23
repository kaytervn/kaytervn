package com.tenant.validation.impl;

import com.tenant.constant.FinanceConstant;
import com.tenant.validation.KeyInformationKind;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class KeyInformationKindValidation implements ConstraintValidator<KeyInformationKind, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(KeyInformationKind constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer kind, ConstraintValidatorContext constraintValidatorContext) {
        if (kind == null && allowNull) {
            return true;
        }
        if (!Objects.equals(kind, FinanceConstant.KEY_INFORMATION_KIND_SERVER) &&
                !Objects.equals(kind, FinanceConstant.KEY_INFORMATION_KIND_WEB)) {
            return false;
        }
        return true;
    }
}

