package com.master.feign.service;

import com.master.dto.ApiMessageDto;
import com.master.feign.FeignConstant;
import com.master.feign.config.CustomFeignConfig;
import com.master.feign.dto.CacheKeyDto;
import com.master.feign.dto.CheckSessionDto;
import com.master.feign.dto.CheckSessionResponse;
import com.master.feign.dto.GetMultiKeyForm;
import com.master.redis.dto.GetPublicKeyDto;
import com.master.redis.dto.PutPublicKeyForm;
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
}
