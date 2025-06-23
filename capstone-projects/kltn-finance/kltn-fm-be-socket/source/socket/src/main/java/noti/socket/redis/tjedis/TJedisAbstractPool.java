package noti.socket.redis.tjedis;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import redis.clients.jedis.Jedis;

public abstract class TJedisAbstractPool {
    protected Logger logger = LogManager.getLogger(TJedisAbstractPool.class);

    public abstract Jedis getJedis();

    public abstract void startRedis();
}
