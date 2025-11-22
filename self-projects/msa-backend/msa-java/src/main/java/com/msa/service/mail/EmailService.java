package com.msa.service.mail;

import com.msa.feign.dto.BrevoEmailDto;
import com.msa.feign.dto.EmailInfoDto;
import com.msa.feign.service.FeignBrevoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
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
    @Value("${brevo.api-key}")
    private String brevoApiKey;
    @Autowired
    private FeignBrevoService feignBrevoService;

    @Async
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

    @Async
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

    @Async
    public void brevoSendEmail(EmailInfoDto toEmail, String subject, String msg) {
        try {
            List<EmailInfoDto> recipients = new ArrayList<>();
            recipients.add(toEmail);
            BrevoEmailDto dto = new BrevoEmailDto();
            EmailInfoDto sender = new EmailInfoDto();
            sender.setEmail(email);
            sender.setName("MSA");
            dto.setSubject(subject);
            dto.setSender(sender);
            dto.setTo(recipients);
            dto.setHtmlContent(msg);
            feignBrevoService.sendEmail(brevoApiKey, dto);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
