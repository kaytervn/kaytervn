package com.msa.validation.impl;

import com.msa.constant.AppConstant;
import com.msa.validation.TagKind;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;

public class TagKindValidation implements ConstraintValidator<TagKind, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(TagKind constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext context) {
        return value == null ? allowNull : List.of(
                AppConstant.TAG_KIND_ACCOUNT,
                AppConstant.TAG_KIND_BANK,
                AppConstant.TAG_KIND_CONTACT,
                AppConstant.TAG_KIND_ID_NUMBER,
                AppConstant.TAG_KIND_LINK,
                AppConstant.TAG_KIND_NOTE,
                AppConstant.TAG_KIND_SCHEDULE,
                AppConstant.TAG_KIND_SOFTWARE
        ).contains(value);
    }
}
