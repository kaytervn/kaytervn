package com.master.feign.service;

import com.master.dto.ApiMessageDto;
import com.master.feign.FeignConstant;
import com.master.feign.config.CustomFeignConfig;
import com.master.feign.dto.DeleteListFileForm;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "file-media-svr", url = "${media.url}", configuration = CustomFeignConfig.class)
public interface FeignFileMediaService {
    @PostMapping(value = "/v1/file/delete-list-file")
    ApiMessageDto<String> deleteListFile(@RequestHeader(FeignConstant.HEADER_AUTHORIZATION) String bearerToken, @RequestBody DeleteListFileForm deleteListFileForm);
}