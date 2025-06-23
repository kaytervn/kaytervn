package com.master.config;

import com.master.exception.BadRequestException;
import com.master.exception.NotFoundException;
import com.master.exception.oauth.CustomOauthException;
import com.master.redis.CacheClientService;
import com.master.service.impl.UserServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.common.exceptions.OAuth2Exception;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.CompositeTokenGranter;
import org.springframework.security.oauth2.provider.TokenGranter;
import org.springframework.security.oauth2.provider.token.TokenEnhancerChain;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
@EnableAuthorizationServer
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Value("${auth.signing.key}")
    private String signingKey;
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private UserServiceImpl userService;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private CacheClientService cacheClientService;
    @Value("${mfa.enabled}")
    private Boolean isMfaEnabled;

    @Bean
    public JwtAccessTokenConverter accessTokenConverter() {
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        converter.setAccessTokenConverter(new CustomTokenConverter());
        converter.setSigningKey(signingKey);
        return converter;
    }

    @Override
    public void configure(ClientDetailsServiceConfigurer configurer) throws Exception {
        configurer.jdbc(jdbcTemplate.getDataSource());
    }

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
        TokenEnhancerChain tokenEnhancerChain = new TokenEnhancerChain();
        tokenEnhancerChain.setTokenEnhancers(Arrays.asList(new CustomTokenEnhancer(jdbcTemplate, objectMapper, isMfaEnabled, cacheClientService), accessTokenConverter()));
        endpoints
                .pathMapping("/oauth/authorize", "/api/authorize")
                .pathMapping("/oauth/token", "/api/token")
                .authenticationManager(authenticationManager)
                .tokenEnhancer(tokenEnhancerChain)
                .tokenGranter(tokenGranter(endpoints))
                .accessTokenConverter(accessTokenConverter())
//                .tokenStore(tokenStore())
                .reuseRefreshTokens(false)
                .userDetailsService(userDetailsService)
                .exceptionTranslator((exception -> {
                            if (exception instanceof NotFoundException) {
                                return ResponseEntity
                                        .status(HttpStatus.NOT_FOUND)
                                        .body(new CustomOauthException(exception.getMessage(), ((NotFoundException) exception).getCode()));
                            }
                            if (exception instanceof BadRequestException) {
                                return ResponseEntity
                                        .badRequest()
                                        .body(new CustomOauthException(exception.getMessage(), ((BadRequestException) exception).getCode()));
                            } else if (exception instanceof OAuth2Exception) {
                                OAuth2Exception oAuth2Exception = (OAuth2Exception) exception;
                                return ResponseEntity
                                        .status(oAuth2Exception.getHttpErrorCode())
                                        .body(new CustomOauthException(oAuth2Exception.getMessage()));
                            } else {
                                throw exception;
                            }
                        })
                );
    }

    private TokenGranter tokenGranter(final AuthorizationServerEndpointsConfigurer endpoints) {
        List<TokenGranter> granters = new ArrayList<>(Collections.singletonList(endpoints.getTokenGranter()));
        granters.add(new CustomTokenGranter(authenticationManager, endpoints.getTokenServices(), endpoints.getClientDetailsService(), endpoints.getOAuth2RequestFactory(), SecurityConstant.GRANT_TYPE_CUSTOMER, userService));
        return new CompositeTokenGranter(granters);
    }

    @Override
    public void configure(AuthorizationServerSecurityConfigurer oauthServer) throws Exception {
        oauthServer.allowFormAuthenticationForClients();
        oauthServer.tokenKeyAccess("hasAuthority('ROLE_TRUSTED_CLIENT')").checkTokenAccess("hasAuthority('ROLE_TRUSTED_CLIENT')");
        oauthServer.checkTokenAccess("permitAll()");
    }
}