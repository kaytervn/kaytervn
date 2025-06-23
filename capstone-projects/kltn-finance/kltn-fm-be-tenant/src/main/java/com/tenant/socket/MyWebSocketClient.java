package com.tenant.socket;

import lombok.extern.slf4j.Slf4j;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URISyntaxException;

@Component
@Slf4j
public class MyWebSocketClient extends WebSocketClient {
    public MyWebSocketClient(@Value("${socket.url}") String socketUrl) throws URISyntaxException {
        super(new URI(socketUrl));
    }

    @Override
    public void onOpen(ServerHandshake handshakedata) {
        log.warn("Connected to WebSocket server");
    }

    @Override
    public void onMessage(String message) {
        log.warn("Received from server: " + message);
    }

    @Override
    public void onClose(int code, String reason, boolean remote) {
        log.error("WebSocket closed: " + reason);
        attemptReconnectWithDelay();
    }

    @Override
    public void onError(Exception ex) {
        log.error("WebSocket error:");
        attemptReconnectWithDelay();
    }

    private void attemptReconnectWithDelay() {
        new Thread(() -> {
            try {
                Thread.sleep(5000);
                this.reconnect();
                log.warn("🔄 Attempted reconnect...");
            } catch (InterruptedException e) {
                log.error("Reconnect interrupted", e);
            }
        }).start();
    }
}
