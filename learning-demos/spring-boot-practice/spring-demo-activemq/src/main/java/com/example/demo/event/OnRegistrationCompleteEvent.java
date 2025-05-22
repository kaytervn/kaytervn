package com.example.demo.event;

import com.example.demo.entity.VerificationToken;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.context.ApplicationEvent;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OnRegistrationCompleteEvent extends ApplicationEvent {
    String token;

    public OnRegistrationCompleteEvent(String token) {
        super(token);
        this.token = token;
    }
}