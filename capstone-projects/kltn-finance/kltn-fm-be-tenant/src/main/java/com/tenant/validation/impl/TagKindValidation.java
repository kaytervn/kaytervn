package com.tenant.validation.impl;

import com.tenant.constant.FinanceConstant;
import com.tenant.validation.TagKind;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class TagKindValidation implements ConstraintValidator<TagKind, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(TagKind constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext constraintValidatorContext) {
        if (value == null && allowNull) {
            return true;
        }
        if (!Objects.equals(value, FinanceConstant.TAG_KIND_TRANSACTION) &&
                !Objects.equals(value, FinanceConstant.TAG_KIND_SERVICE) &&
                !Objects.equals(value, FinanceConstant.TAG_KIND_KEY_INFORMATION) &&
                !Objects.equals(value, FinanceConstant.TAG_KIND_PROJECT)) {
            return false;
        }
        return true;
    }
}
