package com.example.demo.event.impl;

import com.example.demo.configuration.locale.MessageUtil;
import com.example.demo.entity.User;
import com.example.demo.entity.VerificationToken;
import com.example.demo.event.OnRegistrationCompleteEvent;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.concurrent.Executor;


@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RegistrationListener implements ApplicationListener<OnRegistrationCompleteEvent> {

    JavaMailSender mailSender;

    @Override
    public void onApplicationEvent(@NonNull OnRegistrationCompleteEvent event) {
        handleEventAsync(event);
    }

    @Async("taskExecutor")
    public void handleEventAsync(OnRegistrationCompleteEvent event) {
        confirmRegistration(event);
    }

    private void confirmRegistration(OnRegistrationCompleteEvent event) {
        VerificationToken verificationToken = event.getVerificationToken();
        User user = verificationToken.getUser();

        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("Spring Boot DEMO <noreply@example.com>");
            helper.setTo(user.getEmail()); // Địa chỉ email nhận
            helper.setSubject(MessageUtil.getMessage("email.register-subject"));

            String content = "<html><body>";
            content += MessageUtil.getMessage("email.otp") + " <b>" + verificationToken.getToken() + "</b><br><br>";
            content += "<a href=\"http://localhost:8080/auth/registration-confirm?token=" + verificationToken.getToken() + "\">Click here to confirm!</a>";
            content += "</body></html>";

            helper.setText(content, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}