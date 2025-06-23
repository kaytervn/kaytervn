package com.master.validation.impl;

import com.master.constant.MasterConstant;
import com.master.validation.SchemaConstraint;
import org.apache.commons.lang3.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class SchemaValidation implements ConstraintValidator<SchemaConstraint, String> {
    private boolean allowNull;

    @Override
    public void initialize(SchemaConstraint constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        if (!StringUtils.isNoneBlank(value) && allowNull) {
            return true;
        }
        return StringUtils.isNoneBlank(value) && Objects.requireNonNull(value).matches(MasterConstant.SCHEMA_PATTERN);
    }
}
