package com.master.feign.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class LoginErrorDto {
    @JsonProperty("code")
    private String code;
    @JsonProperty("errorCode")
    private String errorCode;
    @JsonProperty("message")
    private String message;
}
