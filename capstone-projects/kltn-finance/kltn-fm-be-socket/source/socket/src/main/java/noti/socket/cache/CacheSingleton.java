package noti.socket.cache;

import feign.Feign;
import feign.FeignException;
import feign.gson.GsonDecoder;
import feign.gson.GsonEncoder;
import noti.common.utils.ConfigurationService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Map;

public class CacheSingleton {
    private static final Logger LOG = LogManager.getLogger(CacheSingleton.class);
    private final ConfigurationService config = new ConfigurationService("configuration.properties");
    private final String CACHE_API_KEY = config.getString("cache.api-key");

    private static CacheSingleton instance;
    private final CacheFeignClient cacheFeignClient;

    private CacheSingleton() {
        String apiUrl = config.getString("cache.url");
        this.cacheFeignClient = Feign.builder()
                .encoder(new GsonEncoder())
                .decoder(new GsonDecoder())
                .target(CacheFeignClient.class, apiUrl);
    }

    public static synchronized CacheSingleton getInstance() {
        if (instance == null) {
            instance = new CacheSingleton();
        }
        return instance;
    }

    public Boolean checkSession(String key, String session) {
        try {
            Map<String, Object> response = cacheFeignClient.checkSession(CACHE_API_KEY, key, session);
            LOG.info(">>> [Cache Client] Response: {}", response);
            Map<String, Object> data = (Map<String, Object>) response.get("data");
            if (data != null && data.containsKey("isValid")) {
                return (Boolean) data.get("isValid");
            }
            return false;
        } catch (FeignException e) {
            if (e.status() == 502) {
                LOG.warn(">>> [Cache Client] 502 Bad Gateway - fallback return true");
                return true;
            }
            LOG.error(">>> [Cache Client] Feign error: {}", e.getMessage(), e);
            return false;
        } catch (Exception e) {
            LOG.error(">>> [Cache Client] Unknown error", e);
            return false;
        }
    }
}
