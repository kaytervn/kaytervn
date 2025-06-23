package noti.socket.redis;

import noti.common.utils.ConfigurationService;
import noti.socket.constant.NotiConstant;
import noti.socket.constant.CacheKeyConstant;
import noti.socket.redis.tjedis.TJedis;
import noti.socket.redis.tjedis.TJedisAbstractPool;
import noti.socket.redis.tjedis.TJedisPool;
import noti.socket.redis.tjedis.TJedisSentinelPool;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import redis.clients.jedis.Jedis;

import java.text.SimpleDateFormat;

/**
 * https://github.com/redisson/redisson
 * https://github.com/redisson/redisson/wiki/Table-of-Content
 * <p>
 * Docker: https://hub.docker.com/r/bitnami/redis-sentinel
 */
public class RedisService {
    private final Logger log = LogManager.getLogger(RedisService.class);
    private static RedisService instance;
    private final TJedis iRedis;
    private final Integer TWO_HOURS = 7200;
    private final SimpleDateFormat DATE_FORMAT;
    /**
     * Keys
     **/
    private static final String PREFIX_KEY_ADMIN = "adm:";
    private static final String PREFIX_KEY_CUSTOMER = "cus:";
    private static final String PREFIX_KEY_EMPLOYEE = "emp:";
    private static final String PREFIX_KEY_MOBILE = "mob:";

    public String getKeyString(Integer keyType, String username, String tenantName) {
        switch (keyType) {
            case CacheKeyConstant.KEY_ADMIN:
                return PREFIX_KEY_ADMIN + username;
            case CacheKeyConstant.KEY_CUSTOMER:
                return PREFIX_KEY_CUSTOMER + username + ":" + tenantName;
            case CacheKeyConstant.KEY_EMPLOYEE:
                return PREFIX_KEY_EMPLOYEE + tenantName + ":" + username;
            case CacheKeyConstant.KEY_MOBILE:
                return PREFIX_KEY_MOBILE + tenantName + ":" + username;
            default:
                return "<>";
        }
    }

    private RedisService() {
        ConfigurationService config = new ConfigurationService("configuration.properties");

        int maxSize = config.getInt("server.redis.threads.size");
        int redisType = config.getInt("redis.type");
        String password = config.getConfig("REDIS_PASSWORD", "redis.password");

        TJedisAbstractPool pool;
        if (redisType == 2) {
            String[] sentinelHosts = config.getStringArray("redis.sentinel.host");
            String masterName = config.getString("redis.master.name");
            pool = new TJedisSentinelPool(sentinelHosts, masterName, maxSize, password);
        } else {
            String standAloneHost = config.getString("redis.host");
            pool = new TJedisPool(standAloneHost, maxSize, password);
        }
        this.iRedis = new TJedis(pool);
        this.DATE_FORMAT = new SimpleDateFormat(NotiConstant.DATE_TIME_FORMAT);
    }

    public Jedis getJedis() {
        return iRedis.getJedis();
    }

    public static RedisService getInstance() {
        if (instance == null) {
            instance = new RedisService();
        }
        return instance;
    }

    public void startRedis() {
        iRedis.startRedis();
    }
}