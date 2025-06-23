package com.master.service.mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class MailServiceImpl {
    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    private ThymeleafService thymeleafService;
    @Value("${spring.mail.username}")
    private String email;

    public void sendVerificationMail(String mail, String code, String fullName) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());
            helper.setFrom("Finance <" + email + ">");
            Map<String, Object> variables = new HashMap<>();
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
            variables.put("date", sdf.format(new Date()));
            variables.put("code", code);
            variables.put("receiver", fullName);
            String content = thymeleafService.createContent("mail-sender-test.html", variables);
            helper.setText(content, true);
            helper.setTo(mail);
            helper.setSubject("[No-Reply] Xác nhận đặt lại mật khẩu");
            javaMailSender.send(message);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
