package noti.socket.thread;

import java.net.URI;
import java.util.Timer;
import java.util.TimerTask;

import noti.common.utils.ConfigurationService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

public class ActiveScheduler {
    private static final Logger LOG = LogManager.getLogger(ActiveScheduler.class);
    private static final long CYCLE_INTERVAL = 10 * 60 * 1000; // 10 minutes
    private WebSocketClient wsClient;
    private final Timer timer = new Timer();
    private final ConfigurationService config = new ConfigurationService("configuration.properties");

    public void start() {
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                connectAndWait();
            }
        }, 0, CYCLE_INTERVAL);
    }

    private void connectAndWait() {
        try {
            wsClient = new WebSocketClient(new URI(config.getConfig("URL", "app.url"))) {
                @Override
                public void onOpen(ServerHandshake handshake) {
                    LOG.error("[ACTIVE] >>> Connected to WebSocket server");
                }

                @Override
                public void onMessage(String message) {
                    LOG.info("Received message: " + message);
                }

                @Override
                public void onClose(int code, String reason, boolean remote) {
                    LOG.error("[ACTIVE] >>> Connection closed");
                }

                @Override
                public void onError(Exception ex) {
                    LOG.error("Error occurred: " + ex.getMessage());
                }
            };

            wsClient.connect();

            Thread.sleep(10000);
            if (wsClient != null && wsClient.isOpen()) {
                wsClient.close();
            }

        } catch (Exception e) {
            LOG.error("Error handling WebSocket connection: " + e.getMessage());
        }
    }

    public void stop() {
        timer.cancel();
        if (wsClient != null) {
            wsClient.close();
        }
    }
}