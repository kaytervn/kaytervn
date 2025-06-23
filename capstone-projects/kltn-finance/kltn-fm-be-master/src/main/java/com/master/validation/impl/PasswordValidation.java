package com.master.validation.impl;

import com.master.constant.MasterConstant;
import com.master.validation.PasswordConstraint;
import org.apache.commons.lang3.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

public class PasswordValidation implements ConstraintValidator<PasswordConstraint, String> {
    private boolean allowNull;

    @Override
    public void initialize(PasswordConstraint constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        List<String> invalidChars = Arrays.asList("/", ":", ";", ",", ".");
        if (!StringUtils.isNoneBlank(value) && allowNull) {
            return true;
        }
        for (String ic : invalidChars) {
            if (value.contains(ic)) {
                return false;
            }
        }
        return StringUtils.isNoneBlank(value) && Objects.requireNonNull(value).matches(MasterConstant.PASSWORD_PATTERN);
    }
}