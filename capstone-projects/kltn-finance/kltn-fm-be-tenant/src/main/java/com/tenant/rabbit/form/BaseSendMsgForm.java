package com.tenant.rabbit.form;

import lombok.Data;

@Data
public class BaseSendMsgForm<T> {
    private String cmd;
    private String app;
    private T data;
    private String token;
    private Integer responseCode;
}
