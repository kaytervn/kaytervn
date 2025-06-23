package com.tenant.validation.impl;

import com.tenant.constant.FinanceConstant;
import com.tenant.validation.TaskState;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class TaskStateValidation implements ConstraintValidator<TaskState, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(TaskState constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext constraintValidatorContext) {
        if (value == null && allowNull) {
            return true;
        }
        if (!Objects.equals(value, FinanceConstant.TASK_STATE_DONE) &&
                !Objects.equals(value, FinanceConstant.TASK_STATE_PENDING)) {
            return false;
        }
        return true;
    }
}
