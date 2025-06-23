package com.tenant.validation.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tenant.constant.FinanceConstant;
import com.tenant.validation.ValidJsonField;

import javax.validation.*;
import java.text.SimpleDateFormat;
import java.util.Set;

public class JsonFieldValidation implements ConstraintValidator<ValidJsonField, String> {
    private boolean allowNull;

    private Class<?> classType;

    private final ObjectMapper mapper = new ObjectMapper()
            .setDateFormat(new SimpleDateFormat(FinanceConstant.DATE_TIME_FORMAT))
            .enable(DeserializationFeature.FAIL_ON_TRAILING_TOKENS);

    @Override
    public void initialize(ValidJsonField constraintAnnotation) {
        this.allowNull = constraintAnnotation.allowNull();
        this.classType = constraintAnnotation.classType();
    }

    @Override
    public boolean isValid(String json, ConstraintValidatorContext validatorContext) {
        if (json == null && allowNull) {
            return true;
        }
        if (json == null) {
            return false;
        }

        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            Validator validator = factory.getValidator();

            Object object = mapper.readValue(json, classType);
            Set<ConstraintViolation<Object>> resultValidate = validator.validate(object);

            if (!resultValidate.isEmpty()) {
                validatorContext.disableDefaultConstraintViolation();
                resultValidate.forEach(result -> validatorContext.buildConstraintViolationWithTemplate(result.getMessageTemplate())
                        .addPropertyNode(result.getPropertyPath().toString()).inIterable()
                        .addConstraintViolation());
                return false;
            }
            factory.close();

            return true;
        } catch (JsonProcessingException e) {
            return false;
        }
    }
}
