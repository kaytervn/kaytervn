package noti.socket.redis.tjedis;

import noti.socket.constant.CacheKeyConstant;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class TJedisPool extends TJedisAbstractPool {
    private JedisPool pool;
    private final int maximumPoolSize;
    private final String hostAndPort;
    private final String password;
    private final ScheduledExecutorService executor;

    public TJedisPool(String hostAndPort, int maximumPoolSize, String password) {
        this.maximumPoolSize = maximumPoolSize;
        this.hostAndPort = hostAndPort;
        this.password = password;
        this.executor = Executors.newSingleThreadScheduledExecutor();
    }

    @Override
    public Jedis getJedis() {
        if (pool == null) {
            throw new IllegalStateException("Jedis pool is not initialized. Call startRedis() first.");
        }
        Jedis jedis = pool.getResource();
        if (CacheKeyConstant.PASSWORD_ENABLED) {
            jedis.auth(password);
        }
        return jedis;
    }

    @Override
    public void startRedis() {
        try {
            String[] hostPort = hostAndPort.split(":");

            JedisPoolConfig poolConfig = new JedisPoolConfig();
            poolConfig.setMaxTotal(maximumPoolSize);
            poolConfig.setMaxIdle(5);
            poolConfig.setBlockWhenExhausted(true);
            poolConfig.setMaxWaitMillis(60000);
            poolConfig.setTestOnBorrow(false);
            pool = new JedisPool(poolConfig,
                    hostPort[0],
                    Integer.parseInt(hostPort[1]),
                    2000,
                    password,
                    true);
            logger.info("Jedis pool initialized successfully with host {} and port {}.", hostPort[0], hostPort[1]);
        } catch (Exception e) {
            logger.error("Failed to initialize Jedis pool: {}", e.getMessage(), e);
            executor.schedule(this::startRedis, 15, TimeUnit.SECONDS);
        }
    }
}
