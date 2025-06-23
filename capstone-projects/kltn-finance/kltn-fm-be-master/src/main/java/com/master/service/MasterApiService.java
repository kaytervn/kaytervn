package com.master.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MasterApiService {
    @Autowired
    private MasterOTPService masterOTPService;
    @Autowired
    private CommonAsyncService commonAsyncService;

    public String getOTPForgetPassword(){
        return masterOTPService.generate(4);
    }

    public void sendEmail(String email, String msg, String subject, boolean html){
        commonAsyncService.sendEmail(email,msg,subject,html);
    }
}
