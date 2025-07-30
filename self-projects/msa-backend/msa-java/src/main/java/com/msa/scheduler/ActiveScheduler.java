package com.msa.scheduler;

import com.msa.feign.service.FeignActiveService;
import com.msa.socket.SocketHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class ActiveScheduler {
    private static final long INTERVAL = 50 * 1000; // 50s
    @Autowired
    private FeignActiveService feignActiveService;
    @Value("#{'${app.active-urls}'.split(',')}")
    private List<String> ACTIVE_URLS;
    @Autowired
    private SocketHandler socketHandler;

    @Scheduled(fixedRate = INTERVAL)
    public void handleActive() {
        pingServer();
        cleanupClientChannel();
    }

    private void pingServer() {
        for (String url : ACTIVE_URLS) {
            try {
                feignActiveService.ping(url);
            } catch (Exception ignored) {
            }
            log.error("GET request sent to {}", url);
        }
    }

    private void cleanupClientChannel() {
        log.warn("#############============>XXXX Clean up key");
        socketHandler.scanAndRemoveChannel();
        log.warn("#############============>XXXX Clean up key Done. Size: " + socketHandler.getChannels().size());
    }
}
