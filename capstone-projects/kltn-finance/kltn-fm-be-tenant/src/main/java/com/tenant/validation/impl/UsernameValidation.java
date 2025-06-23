package com.tenant.validation.impl;

import com.tenant.constant.FinanceConstant;
import com.tenant.validation.UsernameConstraint;
import org.apache.commons.lang3.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class UsernameValidation implements ConstraintValidator<UsernameConstraint, String> {
    private boolean allowNull;

    @Override
    public void initialize(UsernameConstraint constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        if (!StringUtils.isNoneBlank(value) && allowNull) {
            return true;
        }
        return StringUtils.isNoneBlank(value) && Objects.requireNonNull(value).matches(FinanceConstant.USERNAME_PATTERN);
    }
}
