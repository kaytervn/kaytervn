package com.tenant.rabbit;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tenant.constant.FinanceConstant;
import com.tenant.controller.ABasicController;
import com.tenant.multitenancy.tenant.TenantDBContext;
import com.tenant.rabbit.form.BaseSendMsgForm;
import com.tenant.scheduler.SchedulerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
public class RabbitMQListener extends ABasicController {
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private SchedulerService schedulerService;

    @RabbitListener(queues = "${rabbitmq.queue.process-tenant}")
    public void handleProcessScheduler(String message) {
        try {
            BaseSendMsgForm<String> baseSendMsgForm = objectMapper.readValue(message, new TypeReference<>() {});
            if (!FinanceConstant.APP_TENANT.equals(baseSendMsgForm.getApp())) {
                return;
            }
            TenantDBContext.setCurrentTenant(baseSendMsgForm.getData());
            Map<String, Runnable> commandMap = Map.of(
                    FinanceConstant.CMD_DELETE_NOTIFICATION, schedulerService::checkNotificationExpired,
                    FinanceConstant.CMD_CREATE_PAYMENT_PERIOD, schedulerService::createPaymentPeriod,
                    FinanceConstant.CMD_SCHEDULE_SERVICE, schedulerService::checkServiceExpired
            );
            commandMap.getOrDefault(baseSendMsgForm.getCmd(), () ->
                    log.warn("Unknown command received: {}", baseSendMsgForm.getCmd())
            ).run();
        } catch (Exception e) {
            log.error("Error processing received message: {}", e.getMessage(), e);
        }
    }
}