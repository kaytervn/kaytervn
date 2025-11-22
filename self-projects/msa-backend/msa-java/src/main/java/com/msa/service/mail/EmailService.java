package com.msa.service.mail;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
@Slf4j
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    private ThymeleafService thymeleafService;
    @Value("${spring.mail.username}")
    private String email;

    public void sendEmail(String sender, String toEmail, String subject, String templates, Map<String, Object> variables) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
            helper.setFrom(sender + " <" + email + ">");
            String content = thymeleafService.createContent(templates, variables);
            helper.setText(content, true);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            javaMailSender.send(message);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    public void sendEmail(String toEmail, String subject, String msg) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
            helper.setFrom("MSA <" + email + ">");
            helper.setTo(toEmail);
            helper.setSubject("[No-Reply] " + subject);
            helper.setText(msg, false);
            javaMailSender.send(message);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
