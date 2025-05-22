package com.example.demo.validator.impl;

import com.example.demo.dto.request.RegisterRequest;
import com.example.demo.validator.PasswordMatches;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, RegisterRequest> {

    @Override
    public boolean isValid(RegisterRequest request, ConstraintValidatorContext context) {
        return request.getPassword().equals(request.getMatchingPassword());
    }
}