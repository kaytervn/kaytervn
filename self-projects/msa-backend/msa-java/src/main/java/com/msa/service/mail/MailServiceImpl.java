package com.msa.service.mail;

import com.msa.constant.AppConstant;
import com.msa.dto.schedule.ScheduleMailDto;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class MailServiceImpl {
    private static final String SENDER_NAME = "MSA";
    @Autowired
    private EmailService emailService;

    public void sendMsgLockAccount(String mail) {
        String subject = "[No-Reply] Your account has been locked";
        String message = "Your account is locked. Contact the admin for assistance.";
        emailService.sendEmail(mail, subject, message);
    }

    public void sendVerificationMail(String mail, String code, String fullName) {
        String subject = "[No-Reply] Verify your reset password request";
        Map<String, Object> variables = new HashMap<>();
        SimpleDateFormat sdf = new SimpleDateFormat(AppConstant.DATE_FORMAT);
        variables.put("date", sdf.format(new Date()));
        variables.put("code", code);
        variables.put("receiver", fullName);
        emailService.sendEmail(SENDER_NAME, mail, subject, AppConstant.TEMPLATE_RESET_PASSWORD, variables);
    }

    public void sendQuarterlyReminderMail(String mail, String fullName, String link) {
        String subject = "[No-Reply] Activate your account";
        Map<String, Object> variables = new HashMap<>();
        variables.put("name", fullName);
        variables.put("link", link);
        emailService.sendEmail(SENDER_NAME, mail, subject, AppConstant.TEMPLATE_ACTIVE_ACCOUNT, variables);
    }

    public void sendScheduleNotification(ScheduleMailDto dto) {
        String subject = dto.getTitle();
        String sender = dto.getSender();
        Map<String, Object> variables = new HashMap<>();
        variables.put("title", subject);
        variables.put("receiver", dto.getReceiver());
        variables.put("content", dto.getContent());
        variables.put("sender", sender);
        variables.put("date", dto.getDate());
        if (StringUtils.isNotBlank(dto.getLink())) {
            variables.put("link", dto.getLink());
        }
        emailService.sendEmail(sender, dto.getToEmail(), subject, AppConstant.TEMPLATE_SCHEDULE, variables);
    }
}
