package com.finance.data.socket;


import com.finance.data.socket.dto.Message;

public interface KittyRealtimeEvent {
    void onMessageReceived(Message message);
    void onConnectionClosed();
    void onConnectionClosing();
    void onConnectionFailed();
    void onConnectionOpened();
}
