package com.msa.validation.impl;

import com.msa.constant.AppConstant;
import com.msa.validation.EmailConstraint;
import org.apache.commons.lang3.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class EmailValidation implements ConstraintValidator<EmailConstraint, String> {
    private boolean allowNull;

    @Override
    public void initialize(EmailConstraint constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        if (!StringUtils.isNoneBlank(value) && allowNull) {
            return true;
        }
        return StringUtils.isNoneBlank(value) && Objects.requireNonNull(value).matches(AppConstant.EMAIL_PATTERN);
    }
}