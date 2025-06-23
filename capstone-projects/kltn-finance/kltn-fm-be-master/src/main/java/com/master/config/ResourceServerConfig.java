package com.master.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.provider.error.OAuth2AccessDeniedHandler;

@Configuration
@EnableResourceServer
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {
    @Autowired
    private JwtAccessTokenConverter jwtAccessTokenConverter;

    @Autowired
    JsonToUrlEncodedAuthenticationFilter jsonFilter;

    @Bean
    public DefaultTokenServices createTokenServices() {
        DefaultTokenServices defaultTokenServices = new DefaultTokenServices();
        jwtAccessTokenConverter.setAccessTokenConverter(new CustomTokenConverter());
        defaultTokenServices.setTokenStore(new JwtTokenStore(jwtAccessTokenConverter));
        return defaultTokenServices;
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.addFilterAfter(jsonFilter, BasicAuthenticationFilter.class)
                .requestMatchers()
                .and()
                .authorizeRequests()
                .antMatchers("/v2/api-docs", "/configuration/ui", "/swagger-resources/**", "/configuration/**", "/swagger-ui.html", "/index", "/pub/**", "/api/token", "/api/auth/pwd/verify-token",
                        "/api/auth/activate/resend", "/api/auth/pwd", "/api/auth/logout", "/actuator/**").permitAll()
                .antMatchers("/v1/account/request-forget-password", "/v1/account/reset-password").permitAll()
                .antMatchers("/v1/file/download/**").permitAll()
                .antMatchers("/v1/setting/find-by-key", "/v1/setting/find-by-group", "/v1/setting/public").permitAll()
                .antMatchers("/v1/db-config/get-by-name", "/v1/db-config/get-by-tenant-id").permitAll()
                .antMatchers("/v1/account/get-key", "/v1/account/verify-credential").permitAll()
                .antMatchers("/v1/group/employee", "/v1/account/login-employee").permitAll()
                .antMatchers("/**").authenticated()
                .and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and().exceptionHandling().accessDeniedHandler(new OAuth2AccessDeniedHandler());
    }

    @Override
    public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
        resources.resourceId("master");
    }
}