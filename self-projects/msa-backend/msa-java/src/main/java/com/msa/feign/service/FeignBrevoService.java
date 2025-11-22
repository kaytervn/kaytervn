package com.msa.feign.service;

import com.msa.constant.SecurityConstant;
import com.msa.feign.config.CustomFeignConfig;
import com.msa.feign.dto.BrevoEmailDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "brevo-svr", url = "${brevo.url}", configuration = CustomFeignConfig.class)
public interface FeignBrevoService {
    @PostMapping(value = "/v3/smtp/email")
    void sendEmail(@RequestHeader(SecurityConstant.HEADER_BREVO_API_KEY) String apiKey, @RequestBody BrevoEmailDto dto);
}
