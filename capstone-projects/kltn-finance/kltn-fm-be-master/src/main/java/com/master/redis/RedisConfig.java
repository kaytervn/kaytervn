package com.master.redis;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisSentinelConfiguration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisClientConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Configuration
@Slf4j
public class RedisConfig {
    @Value("#{'${spring.redis.sentinel.hosts}'.split(',')}")
    private List<String> sentinelHosts;
    @Value("${spring.redis.master.name}")
    private String masterName;
    @Value("${spring.redis.host}")
    private String host;
    @Value("${spring.redis.port}")
    private Integer port;
    @Value("${spring.redis.type}")
    private int type;
    @Value("${spring.redis.password}")
    private String password;

//    JedisConnectionFactory getPoolSentinelConnection() {
//        Set<String> sentinels = new HashSet<>(sentinelHosts);
//        RedisSentinelConfiguration configuration = new RedisSentinelConfiguration(masterName, sentinels);
//        if (RedisConstant.PASSWORD_ENABLED) {
//            configuration.setPassword(password);
//        }
//        JedisClientConfiguration clientConfig = JedisClientConfiguration.builder().useSsl().build();
//        log.error("Configuring Redis Sentinel connection with masterName: {} and sentinels: {}", masterName, sentinels);
//        return new JedisConnectionFactory(configuration, clientConfig);
//    }
//
//    @Bean
//    public JedisConnectionFactory jedisConnectionFactory() {
//        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(host, port);
//        if (RedisConstant.PASSWORD_ENABLED) {
//            config.setPassword(password);
//        }
//        JedisClientConfiguration.JedisPoolingClientConfigurationBuilder jedisPoolBuilder = (JedisClientConfiguration.JedisPoolingClientConfigurationBuilder) JedisClientConfiguration.builder().useSsl();
//        jedisPoolBuilder.poolConfig(jedisPoolConfig());
//        return new JedisConnectionFactory(config, jedisPoolBuilder.build());
//    }
//
//    @Bean
//    public GenericObjectPoolConfig<?> jedisPoolConfig() {
//        GenericObjectPoolConfig<?> poolConfig = new GenericObjectPoolConfig<>();
//        poolConfig.setMaxTotal(10);
//        poolConfig.setMaxIdle(5);
//        poolConfig.setMinIdle(2);
//        return poolConfig;
//    }
//
//    @Bean
//    public RedisTemplate<String, Object> redisTemplate() {
//        RedisTemplate<String, Object> template = new RedisTemplate<>();
//        if (type == 1) {
//            template.setConnectionFactory(jedisConnectionFactory());
//        } else if (type == 2) {
//            template.setConnectionFactory(getPoolSentinelConnection());
//        } else {
//            throw new IllegalArgumentException("Unsupported Redis type: " + type);
//        }
//        template.setDefaultSerializer(new StringRedisSerializer());
//        template.setKeySerializer(new StringRedisSerializer());
//        template.setHashKeySerializer(new StringRedisSerializer());
//        template.setValueSerializer(new StringRedisSerializer());
//        template.setEnableTransactionSupport(true);
//        log.error("RedisTemplate configured with type: {}", type);
//        return template;
//    }
}