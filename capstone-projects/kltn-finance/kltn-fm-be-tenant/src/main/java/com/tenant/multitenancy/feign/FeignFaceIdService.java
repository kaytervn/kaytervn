package com.tenant.multitenancy.feign;

import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.faceId.VerifyFaceIdDto;
import com.tenant.multitenancy.config.CustomFeignConfig;
import com.tenant.multitenancy.constant.FeignConstant;
import com.tenant.multitenancy.dto.ImagePayloadDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "faceid-svr", url = "${face-id.url}", configuration = CustomFeignConfig.class)
public interface FeignFaceIdService {
    @PostMapping(value = "/register_webcam")
    ApiMessageDto<Object> registerWebCam(@RequestHeader(FeignConstant.HEADER_X_API_KEY) String apiKey, @RequestBody ImagePayloadDto form);

    @PostMapping(value = "/verify_webcam")
    ApiMessageDto<VerifyFaceIdDto> verifyWebCam(@RequestHeader(FeignConstant.HEADER_X_API_KEY) String apiKey, @RequestBody ImagePayloadDto form);
}
