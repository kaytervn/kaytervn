package com.tenant.exception;

import org.springframework.security.access.AccessDeniedException;

public class ErrorNotReadyException extends AccessDeniedException {
    public ErrorNotReadyException(String msg) {
        super(msg);
    }
}