package com.master.rabbit.form;

import lombok.Data;

@Data
public class ProcessTenantForm<T> {
    private String appName;
    private String queueName;
    private T data;
    private String cmd;
    private String token;
}
