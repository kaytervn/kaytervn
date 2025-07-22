package com.msa.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class BasicApiService {
    @Autowired
    private OTPService masterOTPService;

    public String getOTPForgetPassword() {
        return masterOTPService.generate(4);
    }
}