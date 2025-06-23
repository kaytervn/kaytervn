package com.tenant.validation.impl;

import com.tenant.constant.SecurityConstant;
import com.tenant.validation.EmployeeGrantType;
import org.apache.commons.lang3.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;

public class EmployeeGrantTypeValidation implements ConstraintValidator<EmployeeGrantType, String> {
    private boolean allowNull;

    @Override
    public void initialize(EmployeeGrantType constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return StringUtils.isBlank(value) ? allowNull : List.of(
                SecurityConstant.GRANT_TYPE_EMPLOYEE,
                SecurityConstant.GRANT_TYPE_MOBILE
        ).contains(value);
    }
}
