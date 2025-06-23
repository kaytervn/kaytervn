package com.master.exception;

import lombok.Getter;

@Getter
public class BadRequestException extends RuntimeException{
    private final String code;

    public BadRequestException(String message) {
        super(message);
        this.code = null;
    }

    public BadRequestException(String code, String message) {
        super(message);
        this.code = code;
    }
}
