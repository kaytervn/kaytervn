package noti.socket.redis.tjedis;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import redis.clients.jedis.Jedis;

/**
 * https://scalegrid.io/blog/high-availability-with-redis-sentinels-connecting-to-redis-masterslave-sets/
 * <p>
 * https://stackoverflow.com/questions/33842026/how-to-use-scan-commands-in-jedis
 */
public class TJedis {
    protected final Logger logger = LogManager.getLogger(TJedis.class);
    private final TJedisAbstractPool pool;

    public TJedis(TJedisAbstractPool pool) {
        this.pool = pool;
    }

    public void startRedis() {
        pool.startRedis();
    }

    public Jedis getJedis() {
        return pool.getJedis();
    }
}
