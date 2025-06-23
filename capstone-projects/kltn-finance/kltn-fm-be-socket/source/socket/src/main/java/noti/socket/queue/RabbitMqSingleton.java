package noti.socket.queue;

import org.apache.logging.log4j.Logger;

import com.rabbitmq.client.Address;
import com.rabbitmq.client.ConnectionFactory;
import noti.socket.thread.QueueThread;
import noti.socket.utils.QueueService;
import noti.queue.QueueListener;
import noti.queue.RabbitMqManager;

public class RabbitMqSingleton {
    Logger logger = org.apache.logging.log4j.LogManager.getLogger(getClass());
    private static RabbitMqSingleton instance;
    private  ConnectionFactory factory;
    private final RabbitMqManager rabbitMqManager;

    public static RabbitMqSingleton getInstance() {
        if (instance == null) {
            instance = new RabbitMqSingleton();
        }
        return instance;
    }

    private RabbitMqSingleton() {
        factory = new ConnectionFactory();
        factory.setUsername(QueueService.getInstance().getConfig("RABBIT_USERNAME", "queue.username"));
        factory.setPassword(QueueService.getInstance().getConfig("RABBIT_PASSWORD", "queue.password"));
        factory.setVirtualHost(QueueService.getInstance().getConfig("RABBIT_VIRTUAL_HOST", "queue.virtualHost"));

        String[] ips = QueueService.getInstance().getConfigArray("RABBIT_HOST");
        String[] ports = QueueService.getInstance().getConfigArray("RABBIT_PORT");

        Address[] addrArr = null;
        if(ips != null && ips.length> 0){
            addrArr = new Address[ips.length];
            for(int i=0; i< ips.length; i++){
                System.out.println("RabbitMq connect: "+ips[i]+":"+ports[i]);
                addrArr[i]=  new Address(ips[i], Integer.parseInt(ports[i]));
            }
        }
        // simulate dependency management creation and wiring
        rabbitMqManager = new RabbitMqManager(factory);
        rabbitMqManager.setAddress(addrArr);

    }

    public void startQueue() {

        QueueListener queueListener = new QueueListener() {
            @Override
            public String getQueue() {
                return QueueService.getInstance().getStringResource("queue.notification");
            }

            @Override
            public void consumer(String message) {
                QueueService.getInstance().getWorkerPool().executeThread(new QueueThread(message));
            }
        };
        rabbitMqManager.setQueueListener(queueListener);
        rabbitMqManager.start();
    }

    public void stopQueue() {
        rabbitMqManager.stop();
    }

    public void queueDeclare(String queueName) {
        rabbitMqManager.queueDeclare(queueName);

    }
    public void sendMessage(String message, String queueName) {
        rabbitMqManager.sendMessage(message, queueName);
    }
}
