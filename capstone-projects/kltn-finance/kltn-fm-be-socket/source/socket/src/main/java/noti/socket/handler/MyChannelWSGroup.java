package noti.socket.handler;

import io.netty.channel.Channel;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import noti.socket.model.request.LockDeviceDto;
import noti.socket.onesignal.DataForm;
import noti.socket.onesignal.OneSignalSingleton;
import noti.socket.onesignal.RequestPushNotification;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import noti.socket.utils.SocketService;

import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by mac on 5/21/16.
 */
public class MyChannelWSGroup {
    private final static Logger LOG = LogManager.getLogger(MyChannelWSGroup.class.getName());
    private static MyChannelWSGroup instance = null;
    private static final Object lock = new Object();
    private ConcurrentHashMap<String, Channel> channels = new ConcurrentHashMap<String, Channel>();

    private MyChannelWSGroup() {

    }

    public synchronized static MyChannelWSGroup getInstance() {
        if (instance == null) {
            synchronized (lock) {
                instance = new MyChannelWSGroup();
            }
        }
        return instance;
    }

    public String getIdChannel(Channel channel) {
        return SocketService.getInstance().getIdChannel(channel);
    }

    public void addChannel(Channel channel) {
        channels.put(getIdChannel(channel), channel);
    }

    public void removeChannel(Channel channel) {
        channels.remove(getIdChannel(channel));

    }

    public Long getCCU() {
        return channels.mappingCount();
    }

    public void sendMessage(String channelId, String message) {

        Channel channel = channels.get(channelId);
        if (channel != null && channel.isActive()) {
            try {
                channel.writeAndFlush(new TextWebSocketFrame(message));
            } catch (Exception e) {
                LOG.error(e.getMessage(), e);
            }

        } else {
            LOG.error("khong send duoc channel null");

        }
    }

    public boolean checkChannel(String channelId) {
        return channels.containsKey(channelId);
    }

    public void sendMessage(Channel channel, String message) {
        if (channel != null && channel.isActive()) {
            try {
                LOG.info("[Socket] >>> Sending notification {}", message);
                channel.writeAndFlush(new TextWebSocketFrame(message));
            } catch (Exception e) {
                LOG.error(e.getMessage(), e);
            }

        } else {
            LOG.error("khong send duoc channel null");

        }
    }


    public void sendBroadcastMessage(String message) {
        TextWebSocketFrame msg = new TextWebSocketFrame(message);
        for (Channel channel : channels.values()) {
            try {
                if (channel != null && channel.isActive()) {
                    channel.writeAndFlush(msg);
                }
            } catch (Exception e) {
                LOG.error(e.getMessage(), e);
            }
        }

    }

    public void sendMessage(String channelId, LockDeviceDto dto) {
        Channel channel = channels.get(channelId);
        RequestPushNotification request = new RequestPushNotification();
        request.setTitle(dto.getMessage().getMsg());
        request.setContent(dto.getMessage().toJson());

        if (channel != null && channel.isActive()) {
            try {
                LOG.info("[Socket] >>> Sending notification {}", request.getContent());
                channel.writeAndFlush(new TextWebSocketFrame(request.getContent()));
            } catch (Exception e) {
                LOG.error("WebSocket send failed, fallback to push notification: {}", e.getMessage(), e);
            }
        } else {
            LOG.info("Channel is inactive or null");
        }
    }
}
