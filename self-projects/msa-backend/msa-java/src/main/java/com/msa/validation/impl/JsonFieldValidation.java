package com.msa.validation.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.msa.constant.AppConstant;
import com.msa.form.json.BasicObject;
import com.msa.validation.ValidJsonField;
import org.apache.commons.lang3.StringUtils;

import javax.validation.*;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

public class JsonFieldValidation implements ConstraintValidator<ValidJsonField, String> {
    private boolean allowNull;
    private Class<?> classType;
    private int type;
    private final ObjectMapper mapper = new ObjectMapper().setDateFormat(new SimpleDateFormat(AppConstant.DATE_TIME_FORMAT)).enable(DeserializationFeature.FAIL_ON_TRAILING_TOKENS);

    @Override
    public void initialize(ValidJsonField constraintAnnotation) {
        this.allowNull = constraintAnnotation.allowNull();
        this.classType = constraintAnnotation.classType();
        this.type = constraintAnnotation.type();
    }

    @Override
    public boolean isValid(String json, ConstraintValidatorContext validatorContext) {
        if (StringUtils.isBlank(json)) {
            return allowNull;
        }
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            Validator validator = factory.getValidator();
            if (HashMap.class.equals(classType)) {
                HashMap<String, String> map = mapper.readValue(json, new TypeReference<>() {
                });
                if (map.isEmpty()) {
                    return false;
                }
                for (HashMap.Entry<String, String> entry : map.entrySet()) {
                    if (entry.getKey() == null || entry.getKey().trim().isEmpty()) {
                        return false;
                    }
                    if (entry.getValue() == null || entry.getValue().trim().isEmpty()) {
                        return false;
                    }
                }
                return true;
            } else if (List.class.equals(classType)) {
                if (AppConstant.JSON_TYPE_LIST_OBJECT == type) {
                    JavaType listType = mapper.getTypeFactory().constructCollectionType(List.class, BasicObject.class);
                    List<BasicObject> list = mapper.readValue(json, listType);
                    if (list.isEmpty()) {
                        return false;
                    }
                    Set<ConstraintViolation<List<BasicObject>>> violations = validator.validate(list);
                    if (!violations.isEmpty()) {
                        validatorContext.disableDefaultConstraintViolation();
                        violations.forEach(result -> validatorContext.buildConstraintViolationWithTemplate(result.getMessageTemplate())
                                .addPropertyNode(result.getPropertyPath().toString()).inIterable()
                                .addConstraintViolation());
                        return false;
                    }
                    return true;
                }
                return false;
            }
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
