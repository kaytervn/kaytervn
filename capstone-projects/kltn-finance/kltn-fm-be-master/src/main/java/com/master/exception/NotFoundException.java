/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.master.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotFoundException extends RuntimeException{
    private static final long serialVersionUID = 1L;
    private String code;

    public NotFoundException(String message){
        super(message);
    }

    public NotFoundException(String message, String code) {
        super(message);
        this.code = code;
    }
}
