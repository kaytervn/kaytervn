package com.tenant.validation.impl;
import com.tenant.constant.FinanceConstant;
import com.tenant.validation.MessageReactionKind;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;

public class MessageReactionKindValidation implements ConstraintValidator<MessageReactionKind, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(MessageReactionKind constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext context) {
        return value == null ? allowNull : List.of(
                FinanceConstant.MESSAGE_REACTION_KIND_LIKE,
                FinanceConstant.MESSAGE_REACTION_KIND_HEART,
                FinanceConstant.MESSAGE_REACTION_KIND_CRY,
                FinanceConstant.MESSAGE_REACTION_KIND_JOY,
                FinanceConstant.MESSAGE_REACTION_KIND_LAUGH
        ).contains(value);
    }
}