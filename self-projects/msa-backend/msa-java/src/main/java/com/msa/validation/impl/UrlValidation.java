package com.msa.validation.impl;

import com.msa.utils.ABasicUtils;
import com.msa.validation.UrlConstraint;
import org.apache.commons.lang3.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class UrlValidation implements ConstraintValidator<UrlConstraint, String> {
    private boolean allowNull;

    @Override
    public void initialize(UrlConstraint constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        if (!StringUtils.isNoneBlank(value) && allowNull) {
            return true;
        }
        return StringUtils.isNoneBlank(value) && ABasicUtils.isValidUrl(value);
    }
}
