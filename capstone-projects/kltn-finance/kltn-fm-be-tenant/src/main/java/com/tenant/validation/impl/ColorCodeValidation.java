package com.tenant.validation.impl;

import com.tenant.constant.FinanceConstant;
import com.tenant.validation.ColorCodeConstraint;
import org.apache.commons.lang3.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class ColorCodeValidation implements ConstraintValidator<ColorCodeConstraint, String> {
    private boolean allowNull;

    @Override
    public void initialize(ColorCodeConstraint constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        if (!StringUtils.isNoneBlank(value) && allowNull) {
            return true;
        }
        return StringUtils.isNoneBlank(value) && Objects.requireNonNull(value).matches(FinanceConstant.HEX_COLOR_PATTERN);
    }
}
