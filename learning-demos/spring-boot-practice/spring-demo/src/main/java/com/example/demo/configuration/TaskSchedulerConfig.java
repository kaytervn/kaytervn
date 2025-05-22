package com.example.demo.configuration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableScheduling
@Slf4j
public class TaskSchedulerConfig {

    @Scheduled(fixedRate = 60 * 1000)
    public void sendRequest() {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8080/posts";
        try {
            String response = restTemplate.getForObject(url, String.class);
            log.info("Request sent. Response: {}", response);
        } catch (Exception e) {
            log.info("Error sending request: {}", e.getMessage());
        }
    }
}
