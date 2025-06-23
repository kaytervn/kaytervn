package com.master.feign.service;

import com.master.dto.ApiMessageDto;
import com.master.feign.FeignConstant;
import com.master.feign.config.CustomFeignConfig;
import com.master.form.account.InputKeyForm;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "tenant-svr", url = "${tenant.url}", configuration = CustomFeignConfig.class)
public interface FeignTenantService {
    @PostMapping(value = "/v1/account/input-key")
    ApiMessageDto<String> inputKey(@RequestHeader(FeignConstant.HEADER_X_API_KEY) String apiKey, @RequestBody InputKeyForm inputKeyForm);
    @GetMapping(value = "/v1/account/clear-key")
    ApiMessageDto<String> clearKey(@RequestHeader(FeignConstant.HEADER_X_API_KEY) String apiKey);
}