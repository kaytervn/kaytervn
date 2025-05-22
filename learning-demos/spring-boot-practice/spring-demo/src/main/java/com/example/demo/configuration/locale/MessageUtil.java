package com.example.demo.configuration.locale;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class MessageUtil {

    public static String getMessage(String message, String... dynamicValues) {
        return LocaleConfiguration.messageSource().getMessage(message, dynamicValues, LocaleContextHolder.getLocale());
    }

    public static String getMessage(String message, Locale locale, String... dynamicValues) {
        return LocaleConfiguration.messageSource().getMessage(message, dynamicValues, locale);
    }
}
