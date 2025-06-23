package com.tenant.cache.dto;

import lombok.Data;

import java.util.Date;

@Data
public class CacheKeyDto {
    private String key;
    private String session;
    private Date time;
}
