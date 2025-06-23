package noti.socket.utils;

import io.netty.channel.Channel;
import lombok.Getter;
import noti.socket.model.ClientChannel;
import noti.socket.redis.RedisService;
import org.apache.logging.log4j.Logger;
import noti.common.utils.ConfigurationService;
import noti.thread.WorkerPool;

import java.util.Iterator;
import java.util.Timer;
import java.util.concurrent.ConcurrentHashMap;

public class SocketService {
    private static final Logger LOG = org.apache.logging.log4j.LogManager.getLogger(SocketService.class);
    private final int TWO_MINUTE = 2 * 60 * 1000;
    private ConcurrentHashMap<String, ClientChannel> userChannel = new ConcurrentHashMap<String, ClientChannel>();
    private static SocketService instance = null;
    private final ConfigurationService config;
    private final WorkerPool workerPool;

    @Getter
    private final Timer timer = new Timer(false);

    private SocketService(){
        config = new ConfigurationService("configuration.properties");
        workerPool = new WorkerPool(getIntResource("server.socket.threads.size"),getIntResource("server.socket.queue.size"), (r, executor) -> {

        });
    }

    public static SocketService getInstance() {
        if(instance == null){
            instance = new SocketService();
        }
        return instance;
    }

    public String getStringResource(String key){

        return config.getString(key);
    }
    public void setStringResource(String key, String value){
        if(config.containsKey(key)) {
            config.setProperty(key, value);
            try {
                config.save();
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }
    public WorkerPool  getWorkerPool(){
        return workerPool;
    }
    public int getIntResource(String key){

        return config.getInt(key);
    }

    public String[] getStringArray(String key){
        return config.getStringArray(key);
    }

    public void addClientChannel(String userId, ClientChannel channelId){
        userChannel.put(userId, channelId);
        LOG.info("[SocketService] >>> addClientChannel: userId=" + userId + ", channelId=" + channelId);
        LOG.info(channelId);
    }

    public void removeClientChannel(String userId){
        if(userChannel.containsKey(userId)){
            userChannel.remove(userId);
        }
    }

    public  ClientChannel getClientChannel(String userId){
        if(userChannel.containsKey(userId)){
            return userChannel.get(userId);
        }
        return null;
    }


    public String getIdChannel(Channel channel){
        //return QueueService.getInstance().getStringResource("server.id")+"_"+channel.id().asLongText()+"_"+channel.id().asShortText();
        return channel.id().asLongText()+"_"+channel.id().asShortText();
    }

    public void scanAndRemoveChannel(){
        Iterator<String> keys = userChannel.keySet().stream().iterator();
        while (keys.hasNext()){
            String key = keys.next();
            ClientChannel value = userChannel.get(key);
            // > 2 phut thi del no di
            if(System.currentTimeMillis() - value.getTime() > TWO_MINUTE){
                userChannel.remove(key);
//                RedisService.getInstance().handleRemoveKey(value);
            }else{
                LOG.debug("Key exists: {}", key);
            }
        }
    }

    public int countChannelOrder(){
        return userChannel.size();
    }

    public ConcurrentHashMap<String, ClientChannel> getUserChannels() {
        return userChannel;
    }
}
