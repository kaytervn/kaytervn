
package noti.queue;

import com.rabbitmq.client.Channel;

import java.io.IOException;

public interface ChannelCallable<T>
{
    String getDescription();

    T call(Channel channel) throws IOException;
}
