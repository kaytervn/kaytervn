package com.master.validation.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.master.validation.ValidJsonField;

import javax.validation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

public class JsonFieldValidation implements ConstraintValidator<ValidJsonField, String> {
    private boolean allowNull;

    private Class<?> classType;

    private String[] requiredKeys;

    private int type;

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void initialize(ValidJsonField constraintAnnotation) {
        this.allowNull = constraintAnnotation.allowNull();
        this.classType = constraintAnnotation.classType();
        this.requiredKeys = constraintAnnotation.requiredKeys();
        this.type = constraintAnnotation.type();
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
            if (HashMap.class.equals(classType)) {
                HashMap<String, String> map = mapper.readValue(json,
                        new TypeReference<HashMap<String, String>>() {});

                // Validate that map is not empty
                if (map.isEmpty()) {
                    return false;
                }

                for (String requiredKey : requiredKeys) {
                    if (!map.containsKey(requiredKey)) {
                        validatorContext.buildConstraintViolationWithTemplate("Key '" + requiredKey + "' is missing")
                                .addPropertyNode(requiredKey).inIterable()
                                .addConstraintViolation();
                        return false;
                    }
                }

                // Validate each key and value
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
//                if (TenantConstant.LIST_JSON_TYPE_TABLES_FOOD == type) {
//                    JavaType listType = mapper.getTypeFactory().constructCollectionType(List.class, FoodItemWrapperDto.class);
//                    List<FoodItemWrapperDto> list = mapper.readValue(json, listType);
//                    if (list.isEmpty()) {
//                        return false;
//                    }
//                    Set<ConstraintViolation<List<FoodItemWrapperDto>>> violations = validator.validate(list);
//                    if (!violations.isEmpty()) {
//                        validatorContext.disableDefaultConstraintViolation();
//                        violations.forEach(result -> validatorContext.buildConstraintViolationWithTemplate(result.getMessageTemplate())
//                                .addPropertyNode(result.getPropertyPath().toString()).inIterable()
//                                .addConstraintViolation());
//                        return false;
//                    }
//                    return true;
//                }
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
            e.printStackTrace();
            return false;
        }
    }
}
