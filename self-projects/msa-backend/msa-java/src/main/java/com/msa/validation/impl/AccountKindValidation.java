package com.msa.validation.impl;

import com.msa.constant.AppConstant;
import com.msa.validation.AccountKind;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;

public class AccountKindValidation implements ConstraintValidator<AccountKind, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(AccountKind constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext context) {
        return value == null ? allowNull : List.of(
                AppConstant.ACCOUNT_KIND_ROOT,
                AppConstant.ACCOUNT_KIND_LINK
        ).contains(value);
    }
}
