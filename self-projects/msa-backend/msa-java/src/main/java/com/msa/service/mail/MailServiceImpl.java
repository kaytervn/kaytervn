package com.msa.service.mail;

import com.msa.constant.AppConstant;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class MailServiceImpl {
    @Autowired
    private EmailService emailService;

    public void sendMsgLockAccount(String mail) {
        String subject = "Your account has been locked";
        String message = "Your account is locked and will be deleted in 30 days. Contact the admin for assistance.";
        emailService.sendEmail(mail, subject, message);
    }

    public void sendVerificationMail(String mail, String code, String fullName) {
        String subject = "Verify your reset password request";
        Map<String, Object> variables = new HashMap<>();
        SimpleDateFormat sdf = new SimpleDateFormat(AppConstant.DATE_FORMAT);
        variables.put("date", sdf.format(new Date()));
        variables.put("code", code);
        variables.put("receiver", fullName);
        emailService.sendEmail(mail, subject, AppConstant.TEMPLATE_RESET_PASSWORD, variables);
    }

    public void sendQuarterlyReminderMail(String mail, String fullName, String link) {
        String subject = "Activate your account";
        Map<String, Object> variables = new HashMap<>();
        variables.put("name", fullName);
        variables.put("link", link);
        emailService.sendEmail(mail, subject, AppConstant.TEMPLATE_ACTIVE_ACCOUNT, variables);
    }
}
