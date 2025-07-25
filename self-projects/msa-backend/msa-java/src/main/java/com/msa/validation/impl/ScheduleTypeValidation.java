package com.msa.validation.impl;

import com.msa.constant.AppConstant;
import com.msa.validation.ScheduleKind;
import com.msa.validation.ScheduleType;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;

public class ScheduleTypeValidation implements ConstraintValidator<ScheduleType, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(ScheduleType constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext context) {
        return value == null ? allowNull : List.of(
                AppConstant.SCHEDULE_TYPE_AUTO_RENEW,
                AppConstant.SCHEDULE_TYPE_MANUAL_RENEW,
                AppConstant.SCHEDULE_TYPE_SUSPENDED
        ).contains(value);
    }
}
