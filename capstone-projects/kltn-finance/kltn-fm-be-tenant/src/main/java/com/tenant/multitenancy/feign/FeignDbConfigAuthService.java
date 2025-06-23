package com.tenant.multitenancy.feign;

import com.tenant.dto.ApiMessageDto;
import com.tenant.form.account.LoginEmployeeForm;
import com.tenant.multitenancy.config.CustomFeignConfig;
import com.tenant.multitenancy.constant.FeignConstant;
import com.tenant.multitenancy.dto.DbConfigDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "master-svr", url = "${master.url}", configuration = CustomFeignConfig.class)
public interface FeignDbConfigAuthService {
    @GetMapping(value = "/v1/db-config/get-by-name")
    ApiMessageDto<DbConfigDto> getByName(@RequestParam(value = "name") String name, @RequestHeader(FeignConstant.HEADER_X_API_KEY) String apiKey);
    @GetMapping(value = "/v1/group/employee")
    ApiMessageDto<Object> getRoleEmployee(@RequestHeader(FeignConstant.HEADER_X_API_KEY) String apiKey);
    @GetMapping(value = "/v1/account/login-employee")
    OAuth2AccessToken loginEmployee(@RequestHeader(FeignConstant.HEADER_X_API_KEY) String apiKey, @RequestBody LoginEmployeeForm form);
}
