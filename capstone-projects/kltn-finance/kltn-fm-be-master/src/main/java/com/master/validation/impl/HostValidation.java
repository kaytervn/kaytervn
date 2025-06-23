package com.master.validation.impl;

import com.master.constant.MasterConstant;
import com.master.validation.HostConstraint;
import org.apache.commons.lang3.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class HostValidation implements ConstraintValidator<HostConstraint, String> {
    private boolean allowNull;

    @Override
    public void initialize(HostConstraint constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        if (!StringUtils.isNoneBlank(value) && allowNull) {
            return true;
        }
        return StringUtils.isNoneBlank(value) && Objects.requireNonNull(value).matches(MasterConstant.HOST_PATTERN);
    }
}
