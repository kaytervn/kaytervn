package com.master.scheduler;

import com.master.constant.MasterConstant;
import com.master.rabbit.RabbitService;
import com.master.rabbit.form.ProcessTenantForm;
import com.master.repository.LocationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class ServiceScheduler {
    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private RabbitService rabbitService;
    @Value("${rabbitmq.queue.process-tenant}")
    private String processTenantQueue;

    @Scheduled(cron = "0 0 0 * * *", zone = "UTC") // cron format: second | minute | hour | day of month | month | day of week
    public void checkServiceExpired() {
        List<String> tenants = locationRepository.findAllDistinctTenantId();
        for (String tenant : tenants) {
            ProcessTenantForm<String> form = new ProcessTenantForm<>();
            form.setAppName(MasterConstant.APP_TENANT);
            form.setQueueName(processTenantQueue);
            form.setData(tenant);
            form.setCmd(MasterConstant.CMD_SCHEDULE_SERVICE);
            rabbitService.handleSendMsg(form);
        }
    }
}
