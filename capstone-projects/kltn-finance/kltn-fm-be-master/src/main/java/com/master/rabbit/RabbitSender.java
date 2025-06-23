package com.master.rabbit;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
@Slf4j
public class RabbitSender {
    @Autowired
    private RabbitTemplate template;
    @Autowired
    private RabbitAdmin rabbitAdmin;

    public void send(String queueName, String message) {
        createQueueIfNotExist(queueName);
        if (StringUtils.isBlank(message)) {
            log.info("-------> Can not send an empty or null message.");
            return;
        }
        template.convertAndSend(queueName, message);
        log.info(" [x] Sent '" + message + "', queueName: " + queueName);
    }

    public boolean isQueueExist(String queueName) {
        Properties properties = rabbitAdmin.getQueueProperties(queueName);
        return properties != null;
    }

    public void createQueueIfNotExist(String queueName) {
        if (!isQueueExist(queueName)) {
            log.info("-------> Create queue name: " + queueName);
            rabbitAdmin.declareQueue(new Queue(queueName));
        }
    }

    public void removeQueue(String queueName) {
        if (isQueueExist(queueName)) {
            log.info("-------> Delete queue name: " + queueName);
            rabbitAdmin.deleteQueue(queueName);
        }
    }
}
