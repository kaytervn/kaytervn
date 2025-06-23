package noti.socket.utils;

import org.apache.logging.log4j.Logger;
import noti.common.utils.ConfigurationService;
import noti.socket.queue.RabbitMqSingleton;
import noti.socket.thread.QueueThread;
import noti.thread.WorkerPool;

public class QueueService {
    private static final Logger LOG = org.apache.logging.log4j.LogManager.getLogger(QueueService.class);

    private static QueueService instance = null;
    private final ConfigurationService config;
    private final WorkerPool workerPool;
    private QueueService(){
        config = new ConfigurationService("configuration.properties");
        workerPool = new WorkerPool(getIntResource("server.queue.threads.size"),getIntResource("server.queue.threads.queue.size"), (r, executor) -> {
            //push lại vào queue, sẽ xử lý sau
            QueueThread queueThread = (QueueThread)r;
            RabbitMqSingleton.getInstance().sendMessage(queueThread.getData(), QueueService.getInstance().getStringResource("queue.chat"));
        });
    }

    public static QueueService getInstance() {
        if(instance == null){
            instance = new QueueService();
        }
        return instance;
    }

    public String getStringResource(String key){
        return config.getString(key);
    }

    public String getConfig(String env, String key){
        return config.getConfig(env, key);
    }

    public String[] getConfigArray(String env){
        return config.getConfigArray(env);
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
}
