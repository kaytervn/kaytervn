package com.tenant.validation.impl;

import com.tenant.constant.FinanceConstant;
import com.tenant.validation.ChatroomKind;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;

public class ChatroomKindValidation implements ConstraintValidator<ChatroomKind, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(ChatroomKind constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext context) {
        return value == null ? allowNull : List.of(
                FinanceConstant.CHATROOM_KIND_GROUP,
                FinanceConstant.CHATROOM_KIND_DIRECT_MESSAGE
        ).contains(value);
    }
}