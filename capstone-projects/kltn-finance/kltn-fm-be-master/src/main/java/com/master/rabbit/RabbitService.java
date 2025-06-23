package com.master.rabbit;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.master.rabbit.form.BaseSendMsgForm;
import com.master.rabbit.form.ProcessTenantForm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class RabbitService {
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private RabbitSender rabbitSender;

    public <T> void handleSendMsg(ProcessTenantForm<T> processTenantForm) {
        BaseSendMsgForm<T> form = new BaseSendMsgForm<>();
        form.setApp(processTenantForm.getAppName());
        form.setCmd(processTenantForm.getCmd());
        form.setData(processTenantForm.getData());
        form.setToken(processTenantForm.getToken());
        String msg;
        try {
            msg = objectMapper.writeValueAsString(form);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        // create queue if existed
        createQueueIfNotExist(processTenantForm.getQueueName());

        // push msg
        rabbitSender.send(processTenantForm.getQueueName(), msg);
    }

    private void createQueueIfNotExist(String queueName) {
        rabbitSender.createQueueIfNotExist(queueName);
    }
}
