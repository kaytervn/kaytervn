package com.msa.scheduler;

import com.msa.cache.SessionService;
import com.msa.constant.AppConstant;
import com.msa.constant.SecurityConstant;
import com.msa.service.encryption.EncryptionService;
import com.msa.service.mail.MailServiceImpl;
import com.msa.storage.master.model.User;
import com.msa.storage.master.repository.UserRepository;
import com.msa.utils.GenerateUtils;
import com.msa.utils.ZipUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

@Component
@Slf4j
public class QuarterlyReminderScheduler {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    @Lazy
    private SessionService sessionService;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private EncryptionService encryptionService;
    @Value("${app.client-domain}")
    private String clientDomain;

    @Scheduled(cron = "0 0 0 1 1,4,7,10 *", zone = SecurityConstant.TIMEZONE_VIETNAM)
    public void sendMessageReminder() {
        userRepository.updateAllActiveUserStatus(AppConstant.STATUS_PENDING);
        List<User> users = userRepository.findAllByStatus(AppConstant.STATUS_PENDING);
        for (User user : users) {
            try {
                String username = user.getUsername();
                String token = encryptionService.serverEncrypt(ZipUtils.zipString(
                        String.join(";", List.of(
                                username,
                                GenerateUtils.generateRandomString(10),
                                new Date().toString()))));
                if (StringUtils.isBlank(token)) {
                    return;
                }
                String activationLink = clientDomain + "/activate-account/" + URLEncoder.encode(encryptionService.clientEncryptInjectNonce(token), StandardCharsets.UTF_8);
                sessionService.sendMessageLockUser(user.getKind(), username);
                mailService.sendQuarterlyReminderMail(user.getEmail(), user.getFullName(), activationLink);
            } catch (Exception e) {
                log.error(e.getMessage());
            }
        }
        log.info("Account activation request scheduler executed");
    }
}

