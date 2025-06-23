package com.finance.data.socket;


import com.finance.data.socket.dto.Message;
import com.tinder.scarlet.WebSocket;
import com.tinder.scarlet.ws.Receive;
import com.tinder.scarlet.ws.Send;

import io.reactivex.rxjava3.core.Flowable;

public interface KittyService {
    @Receive
    Flowable<WebSocket.Event> observeWebSocketEvent();
    @Send
    void request(Message data);
    @Receive
    Flowable<Message> message();
}
