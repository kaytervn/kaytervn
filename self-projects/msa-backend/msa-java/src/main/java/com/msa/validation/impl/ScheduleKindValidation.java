package com.msa.validation.impl;

import com.msa.constant.AppConstant;
import com.msa.validation.ScheduleKind;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;

public class ScheduleKindValidation implements ConstraintValidator<ScheduleKind, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(ScheduleKind constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext context) {
        return value == null ? allowNull : List.of(
                AppConstant.SCHEDULE_KIND_DAYS,
                AppConstant.SCHEDULE_KIND_MONTHS,
                AppConstant.SCHEDULE_KIND_DAY_MONTH,
                AppConstant.SCHEDULE_KIND_DATE
        ).contains(value);
    }
}
