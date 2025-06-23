package com.tenant.socket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Configuration
public class WebSocketClientConfig {
    @Autowired
    private MyWebSocketClient client;

    @PostConstruct
    public void init() {
        client.connect();
    }
}
