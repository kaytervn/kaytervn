package com.example.service.impl;

import com.example.service.MyService;

public class MyServiceImpl implements MyService {
    @Override
    public String serve() {
        return "Service is serving!";
    }
}
