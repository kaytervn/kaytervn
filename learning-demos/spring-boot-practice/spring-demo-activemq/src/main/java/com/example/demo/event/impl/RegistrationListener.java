package com.example.demo.event.impl;

import com.example.demo.event.OnRegistrationCompleteEvent;
import jakarta.jms.Destination;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RegistrationListener {

    JmsTemplate jmsTemplate;
    Destination emailQueue;

    @EventListener
    public void onApplicationEvent(OnRegistrationCompleteEvent event) {
        jmsTemplate.convertAndSend(emailQueue, event.getToken());
    }
}