package noti.socket.redis.tjedis;

import noti.socket.constant.CacheKeyConstant;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.JedisSentinelPool;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class TJedisSentinelPool extends TJedisAbstractPool {
    private JedisSentinelPool sentinelPool;
    private final String masterName;
    private final int maximumPoolSize;
    private final String[] hosts;
    private final String password;

    private final ScheduledExecutorService executor;

    public TJedisSentinelPool(String[] hosts, String masterName, int maximumPoolSize, String password) {
        this.masterName = masterName;
        this.maximumPoolSize = maximumPoolSize;
        this.hosts = hosts;
        this.password = password;
        this.executor = Executors.newSingleThreadScheduledExecutor();
    }

    @Override
    public Jedis getJedis() {
        if (sentinelPool == null) {
            throw new IllegalStateException("Sentinel pool is not initialized. Ensure startRedis() is called successfully.");
        }
        Jedis jedis = sentinelPool.getResource();
        if (CacheKeyConstant.PASSWORD_ENABLED) {
            jedis.auth(password);
        }
        return jedis;
    }

    @Override
    public void startRedis() {
        try {
            Set<String> sentinels = new HashSet<>(Arrays.asList(hosts));
            JedisPoolConfig poolConfig = new JedisPoolConfig();
            poolConfig.setMaxTotal(maximumPoolSize);
            poolConfig.setMaxIdle(5);
            poolConfig.setBlockWhenExhausted(true);
            poolConfig.setMaxWaitMillis(60000);
            poolConfig.setTestOnBorrow(false);
            sentinelPool = new JedisSentinelPool(masterName, sentinels, poolConfig);
        } catch (Exception e) {
            logger.error("Failed to initialize Redis Sentinel Pool: {}", e.getMessage(), e);
            executor.schedule(this::startRedis, 15, TimeUnit.SECONDS);
        }
    }
}
