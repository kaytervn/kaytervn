package com.user_spring.mapper.utils;

import org.mapstruct.Mapper;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface MapperUtils {

    @Named("toUpperCase")
    default String toUpperCase(String value) {
        if (value == null) {
            return null;
        }
        return value.toUpperCase().trim().replaceAll(" ", "_");
    }
}