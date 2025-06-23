package noti.queue;

import com.rabbitmq.client.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class RabbitMqManager implements ShutdownListener {

    protected final static Logger logger = LogManager.getLogger(RabbitMqManager.class);
    protected final ConnectionFactory factory;
    protected final ScheduledExecutorService executor;
    protected volatile Connection connection = null;
    private static Channel channel = null;
    private static QueueListener queueListener = null;
    private Address[] address;

    public RabbitMqManager(final ConnectionFactory factory) {
        this.factory = factory;
        executor = Executors.newSingleThreadScheduledExecutor();
        connection = null;
    }

    public void setAddress(Address[] address) {
        this.address = address;
    }

    public Address[] getAddress() {
        return address;
    }

    public void setQueueListener(QueueListener queueListener){
        this.queueListener = queueListener;
    }

    public void start() {
        try {
            // Kiểm tra nếu địa chỉ đã được cấu hình và kết nối
            if (address != null && address.length > 0) {
                // Sử dụng địa chỉ từ cấu hình
                connection = factory.newConnection(address);
            } else {
                // Nếu không có địa chỉ cấu hình, sử dụng mặc định
                connection = factory.newConnection();
            }

            connection.addShutdownListener(this);
            System.out.println("Connected to RabbitMQ at host: " + factory.getHost() + ":" + factory.getPort());
            logger.info("Connected to RabbitMQ at host: " + factory.getHost() + ":" + factory.getPort());

            // Kiểm tra listener có tồn tại và khởi tạo công việc
            if (queueListener != null && queueListener.getQueue() != null) {
                doMyBusiness(queueListener);
            }
        } catch (final Exception e) {
            System.out.println("Failed to connect to RabbitMQ at host: " + factory.getHost() + ":" + factory.getPort() + e);
            logger.error("Failed to connect to RabbitMQ at host: " + factory.getHost() + ":" + factory.getPort(), e);
            asyncWaitAndReconnect();
        }
    }

    private void doMyBusiness(QueueListener queueListener) {
        queueDeclare(queueListener.getQueue());
        Consumer consumer = new DefaultConsumer(channel) {
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body)
                    throws IOException {
                try {
                    String message = new String(body, "UTF-8");
                    if(queueListener != null) {
                        queueListener.consumer(message);
                    }
                } catch (Exception ex) {
                    logger.error("Error handling message: " + ex.getMessage(), ex);
                }
            }
        };
        try {
            channel.basicConsume(queueListener.getQueue(), true, consumer);
        } catch (Exception ex) {
            logger.error("Error consuming message: " + ex.getMessage(), ex);
        }
    }

    public void shutdownCompleted(final ShutdownSignalException cause) {
        if (!cause.isInitiatedByApplication()) {
            logger.info("Lost connection to RabbitMQ at " + factory.getHost() + ":" + factory.getPort(), cause);
            channel = null;
            connection = null;
            asyncWaitAndReconnect();
        }
    }

    protected void asyncWaitAndReconnect() {
        executor.schedule(() -> start(), 15, TimeUnit.SECONDS);
    }

    public void stop() {
        executor.shutdownNow();

        if (connection == null) {
            return;
        }

        try {
            if (channel != null) {
                channel.close();
            }
            connection.close();
        } catch (final Exception e) {
            logger.error("Failed to close RabbitMQ connection", e);
        } finally {
            connection = null;
        }
    }

    public Channel createChannel() {
        try {
            return connection == null ? null : connection.createChannel();
        } catch (final Exception e) {
            logger.error("Failed to create channel", e);
            return null;
        }
    }

    public void closeChannel(final Channel channel) {
        if (channel != null && channel.isOpen()) {
            try {
                channel.close();
            } catch (final Exception e) {
                logger.error("Failed to close channel: " + channel, e);
            }
        }
    }

    private Channel getChannel() {
        if (channel == null || !channel.isOpen()) {
            channel = createChannel();
        }
        return channel;
    }

    public void queueDeclare(String queueName) {
        try {
            AMQP.Queue.DeclareOk ok = getChannel().queueDeclare(queueName, true, false, false, null);
        } catch (Exception e) {
            logger.error("Error declaring queue: " + e.getMessage(), e);
        }
    }

    public void sendMessage(String message, String queueName) {
        try {
            getChannel().basicPublish("", queueName, null, message.getBytes("UTF-8"));
        } catch (Exception e) {
            logger.error("Error sending message: " + e.getMessage(), e);
        }
    }
}

