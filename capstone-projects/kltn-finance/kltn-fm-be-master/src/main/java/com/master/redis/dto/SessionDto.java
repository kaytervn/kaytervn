package com.master.redis.dto;

import lombok.Data;

import java.util.Date;

@Data
public class SessionDto {
    private Date time;
    private String session;
}
