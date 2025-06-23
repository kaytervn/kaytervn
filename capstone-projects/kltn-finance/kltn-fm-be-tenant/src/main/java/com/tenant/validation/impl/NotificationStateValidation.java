package com.tenant.validation.impl;

import com.tenant.constant.FinanceConstant;
import com.tenant.validation.NotificationState;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class NotificationStateValidation implements ConstraintValidator<NotificationState, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(NotificationState constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer state, ConstraintValidatorContext constraintValidatorContext) {
        if (state == null && allowNull) {
            return true;
        }
        if (!Objects.equals(state, FinanceConstant.NOTIFICATION_STATE_SENT) &&
                !Objects.equals(state, FinanceConstant.NOTIFICATION_STATE_READ)) {
            return false;
        }
        return true;
    }
}