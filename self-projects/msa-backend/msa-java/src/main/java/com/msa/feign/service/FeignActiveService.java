package com.msa.feign.service;

import com.msa.constant.SecurityConstant;
import com.msa.feign.config.CustomFeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "active-svr", url = SecurityConstant.FEIGN_URL, configuration = CustomFeignConfig.class)
public interface FeignActiveService {
    @GetMapping(value = "")
    Object ping(@RequestHeader(SecurityConstant.FEIGN_URL) String url);
}
