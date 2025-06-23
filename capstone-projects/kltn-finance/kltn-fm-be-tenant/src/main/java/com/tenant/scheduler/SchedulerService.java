package com.tenant.scheduler;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.service.ServiceReminderDto;
import com.tenant.service.KeyService;
import com.tenant.service.TransactionService;
import com.tenant.storage.tenant.model.Notification;
import com.tenant.storage.tenant.model.PaymentPeriod;
import com.tenant.storage.tenant.repository.NotificationRepository;
import com.tenant.storage.tenant.repository.PaymentPeriodRepository;
import com.tenant.storage.tenant.repository.ServiceRepository;
import com.tenant.storage.tenant.repository.TransactionRepository;
import com.tenant.utils.AESUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class SchedulerService {
    @Autowired
    private NotificationRepository notificationRepository;
    @Value("${notification.timeout}")
    private Integer notificationTimeoutConfig;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private PaymentPeriodRepository paymentPeriodRepository;
    @Autowired
    private KeyService keyService;
    @Autowired
    private TransactionService transactionService;
    @Autowired
    private ServiceRepository serviceRepository;

    public void checkNotificationExpired() {
        LocalDateTime dateTimeBeforeDays = LocalDateTime.now().minusDays(notificationTimeoutConfig);
        Date dateBeforeDays = Date.from(dateTimeBeforeDays.atZone(ZoneId.systemDefault()).toInstant());
        notificationRepository.deleteAllNotificationExpired(dateBeforeDays);
    }

    public void createPaymentPeriod() {
        if (keyService.getFinanceSecretKey() == null) {
            log.error("ERROR-NOT-READY");
            return;
        }
        ZoneId vnZoneId = ZoneId.of("Asia/Ho_Chi_Minh");
        ZonedDateTime nowInVN = ZonedDateTime.now(vnZoneId);
        LocalDate firstDayOfPreviousMonth = nowInVN.toLocalDate().minusMonths(1).withDayOfMonth(1);
        LocalDate lastDayOfPreviousMonth = nowInVN.toLocalDate().minusMonths(1).withDayOfMonth(nowInVN.toLocalDate().minusMonths(1).lengthOfMonth());
        ZonedDateTime startDateVN = firstDayOfPreviousMonth.atStartOfDay(vnZoneId);
        ZonedDateTime endDateVN = lastDayOfPreviousMonth.atTime(23, 59, 59).atZone(vnZoneId);
        ZonedDateTime startDateUTC = startDateVN.withZoneSameInstant(ZoneId.of("UTC"));
        ZonedDateTime endDateUTC = endDateVN.withZoneSameInstant(ZoneId.of("UTC"));
        Date startDate = Date.from(startDateUTC.toInstant());
        Date endDate = Date.from(endDateUTC.toInstant());
        PaymentPeriod paymentPeriod = new PaymentPeriod();
        paymentPeriod.setName(AESUtils.encrypt(keyService.getFinanceSecretKey(), new SimpleDateFormat("MM/yyyy").format(endDate), FinanceConstant.AES_ZIP_ENABLE));
        paymentPeriod.setState(FinanceConstant.PAYMENT_PERIOD_STATE_CREATED);
        paymentPeriod.setStartDate(startDate);
        paymentPeriod.setEndDate(endDate);
        paymentPeriodRepository.save(paymentPeriod);
        transactionRepository.updateAllByStateAndCreatedDate(paymentPeriod.getId(), FinanceConstant.TRANSACTION_STATE_APPROVE, paymentPeriod.getStartDate(), paymentPeriod.getEndDate());
        transactionService.recalculatePaymentPeriod(paymentPeriod.getId());
    }

    public void checkServiceExpired() {
        String key = keyService.getFinanceSecretKey();
        if (StringUtils.isBlank(key)) {
            log.error("[SERVICE SCHEDULER] ERROR-NOT-READY");
            return;
        }
        List<ServiceReminderDto> serviceReminderDtoList = serviceRepository.getListServiceReminderDto();
        List<Notification> notifications = new ArrayList<>();
        for (ServiceReminderDto dto : serviceReminderDtoList) {
            if (dto.getAccountId() != null) {
                String serviceName = AESUtils.decrypt(key, dto.getServiceName(), FinanceConstant.AES_ZIP_ENABLE);
                String dayOrDays = dto.getNumberOfDueDays() != 1 ? " days" : " day";
                String message = "Your " + serviceName + " service is due in " + dto.getNumberOfDueDays() + dayOrDays;
                notifications.add(createNotification(dto.getServiceId(), dto.getAccountId(), message));
            }
            if (dto.getNumberOfDueDays() <= 0) {
                serviceRepository.findById(dto.getServiceId()).ifPresent(service -> {
                    transactionService.updateExpirationDate(service);
                });
            }
        }
        if (!notifications.isEmpty()) {
            notificationRepository.saveAll(notifications);
        }
    }

    private Notification createNotification(Long serviceId, Long accountId, String message) {
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setState(FinanceConstant.NOTIFICATION_STATE_SENT);
        notification.setServiceId(serviceId);
        notification.setAccountId(accountId);
        return notification;
    }
}
