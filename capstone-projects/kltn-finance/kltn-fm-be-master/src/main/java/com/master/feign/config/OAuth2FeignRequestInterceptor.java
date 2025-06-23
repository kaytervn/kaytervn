package com.master.feign.config;

import com.master.feign.FeignConstant;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Data
@Slf4j
@Component
public class OAuth2FeignRequestInterceptor implements RequestInterceptor {
    @Override
    public void apply(RequestTemplate template) {
        if (template.headers().containsKey(FeignConstant.TENANT_URL)) {
            template.target((String) template.headers().get(FeignConstant.TENANT_URL).toArray()[0]);
            template.removeHeader(FeignConstant.TENANT_URL);
        }
    }
}