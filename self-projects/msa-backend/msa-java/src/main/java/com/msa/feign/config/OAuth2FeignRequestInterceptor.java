package com.msa.feign.config;

import com.msa.constant.SecurityConstant;
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
        if (template.headers().containsKey(SecurityConstant.FEIGN_URL)) {
            template.target((String) template.headers().get(SecurityConstant.FEIGN_URL).toArray()[0]);
            template.removeHeader(SecurityConstant.FEIGN_URL);
        }
    }
}