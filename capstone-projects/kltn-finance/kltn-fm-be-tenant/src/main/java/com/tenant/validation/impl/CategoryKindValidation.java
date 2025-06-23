package com.tenant.validation.impl;

import com.tenant.constant.FinanceConstant;
import com.tenant.validation.CategoryKind;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class CategoryKindValidation implements ConstraintValidator<CategoryKind, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(CategoryKind constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer kind, ConstraintValidatorContext constraintValidatorContext) {
        if (kind == null && allowNull) {
            return true;
        }
        if (!Objects.equals(kind, FinanceConstant.CATEGORY_KIND_INCOME) &&
                !Objects.equals(kind, FinanceConstant.CATEGORY_KIND_EXPENDITURE)) {
            return false;
        }
        return true;
    }
}
