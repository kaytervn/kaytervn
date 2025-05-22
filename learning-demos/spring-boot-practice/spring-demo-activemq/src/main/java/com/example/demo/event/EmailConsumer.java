package com.example.demo.event;

import com.example.demo.configuration.locale.MessageUtil;
import com.example.demo.entity.User;
import com.example.demo.entity.VerificationToken;
import com.example.demo.exception.AppException;
import com.example.demo.repository.VerificationTokenRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailConsumer {

    JavaMailSender mailSender;
    VerificationTokenRepository verificationTokenRepository;

    @JmsListener(destination = "REGISTRATION_QUEUE")
    public void handleEmailQueue(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new AppException("verify-token.error.not-found", HttpStatus.NOT_FOUND));
        User user = verificationToken.getUser();
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("Spring Boot DEMO <noreply@example.com>");
            helper.setTo(user.getEmail());
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