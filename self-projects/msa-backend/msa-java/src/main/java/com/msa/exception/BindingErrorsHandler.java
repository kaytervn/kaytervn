package com.msa.exception;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.msa.form.ErrorForm;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Aspect
@Component
@Slf4j
public class BindingErrorsHandler {
    final ObjectMapper mapper = new ObjectMapper();

    @Before("@within(org.springframework.web.bind.annotation.RestController)")
    public void logBefore(JoinPoint joinPoint) {
        Arrays.stream(joinPoint.getArgs())
                .filter(o -> o instanceof BindingResult)
                .map(o -> (BindingResult) o)
                .forEach(errors -> {
                    if (errors.hasErrors()) {
                        List<ErrorForm> errorForms = new ArrayList<>();
                        errors.getAllErrors().forEach(it -> errorForms.add(new ErrorForm(((FieldError) it).getField(), it.getDefaultMessage())));
                        try {
                            String json = mapper.writeValueAsString(errorForms);
                            throw new MyBindingException(json);
                        } catch (JsonProcessingException jPE) {
                            log.error(jPE.getMessage(), jPE);
                        }
                    }
                });
    }
}