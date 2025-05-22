package com.base.auth.validation.impl;


import com.base.auth.constant.UserBaseConstant;
import com.base.auth.validation.NationKind;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Objects;

public class NationKindValidation implements ConstraintValidator<NationKind,Integer> {

    private boolean allowNull;

    @Override
    public void initialize(NationKind constraintAnnotation) { allowNull = constraintAnnotation.allowNull(); }

    @Override
    public boolean isValid(Integer kind, ConstraintValidatorContext constraintValidatorContext) {
        if(kind == null && allowNull) {
            return true;
        }
        if(!Objects.equals(kind, UserBaseConstant.NATION_KIND_PROVINCE) &&
                !Objects.equals(kind, UserBaseConstant.NATION_KIND_DISTRICT) &&
                !Objects.equals(kind, UserBaseConstant.NATION_KIND_COMMUNE)) {
            return false;
        }
        return true;
    }
}
