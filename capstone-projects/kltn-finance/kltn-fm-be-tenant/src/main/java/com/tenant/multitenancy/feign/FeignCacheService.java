package com.tenant.multitenancy.feign;

import com.tenant.cache.dto.*;
import com.tenant.dto.ApiMessageDto;
import com.tenant.multitenancy.config.CustomFeignConfig;
import com.tenant.multitenancy.constant.FeignConstant;
import com.tenant.multitenancy.dto.ChatRequestAnswerDto;
import com.tenant.multitenancy.dto.ChatRequestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "cache-svr", url = "${cache.url}", configuration = CustomFeignConfig.class)
public interface FeignCacheService {
    @PostMapping(value = "/v1/cache/put-key")
    ApiMessageDto<String> putKey(@RequestHeader(FeignConstant.HEADER_X_API_KEY) String apiKey, @RequestBody CacheKeyDto form);

    @GetMapping(value = "/v1/cache/get-key/{key}")
    ApiMessageDto<CacheKeyDto> getKey(@RequestHeader(FeignConstant.HEADER_X_API_KEY) String apiKey, @PathVariable("key") String key);

    @DeleteMapping(value = "/v1/cache/remove-key/{key}")
    ApiMessageDto<CacheKeyDto> removeKey(@RequestHeader(FeignConstant.HEADER_X_API_KEY) String apiKey, @PathVariable("key") String key);

    @PostMapping(value = "/v1/cache/check-session")
    ApiMessageDto<CheckSessionResponse> checkSession(@RequestHeader(FeignConstant.HEADER_X_API_KEY) String apiKey, @RequestBody CheckSessionDto form);

    @GetMapping(value = "/v1/cache/get-key-by-pattern/{pattern}")
    ApiMessageDto<List<CacheKeyDto>> getKeyByPattern(@RequestHeader(FeignConstant.HEADER_X_API_KEY) String apiKey, @PathVariable("pattern") String pattern);

    @DeleteMapping(value = "/v1/cache/remove-key-by-pattern/{pattern}")
    ApiMessageDto<List<CacheKeyDto>> removeKeyByPattern(@RequestHeader(FeignConstant.HEADER_X_API_KEY) String apiKey, @PathVariable("pattern") String pattern);

    @PostMapping(value = "/v1/cache/get-multi-key")
    ApiMessageDto<List<CacheKeyDto>> getMultiKeys(@RequestHeader(FeignConstant.HEADER_X_API_KEY) String apiKey, @RequestBody GetMultiKeyForm form);

    @PostMapping(value = "/v1/cache/put-public-key")
    ApiMessageDto<String> putPublicKey(@RequestHeader(FeignConstant.HEADER_X_API_KEY) String apiKey, @RequestBody PutPublicKeyForm form);

    @GetMapping(value = "/v1/cache/get-public-key/{key}")
    ApiMessageDto<GetPublicKeyDto> getPublicKey(@RequestHeader(FeignConstant.HEADER_X_API_KEY) String apiKey, @PathVariable("key") String key);

    @DeleteMapping(value = "/v1/embedding/delete/{id}")
    ApiMessageDto<String> deleteFaceId(@RequestHeader(FeignConstant.HEADER_X_API_KEY) String apiKey, @PathVariable("id") String id);

    @PostMapping(value = "/v1/gemini/send-message")
    ApiMessageDto<ChatRequestAnswerDto> sendMessageGenAi(@RequestHeader(FeignConstant.HEADER_X_API_KEY) String apiKey, @RequestBody ChatRequestDto form);
}
