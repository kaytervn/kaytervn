package com.master.feign.dto;

import lombok.Data;

@Data
public class CheckSessionDto {
    private String key;
    private String session;
}
