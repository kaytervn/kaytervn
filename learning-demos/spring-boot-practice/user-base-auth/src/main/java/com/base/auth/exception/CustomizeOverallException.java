package com.base.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class CustomizeOverallException extends RuntimeException{
    public CustomizeOverallException(String message) {
        super(message);
    }
}
