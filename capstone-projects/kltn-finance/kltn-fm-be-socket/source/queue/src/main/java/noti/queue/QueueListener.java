package noti.queue;

/**
 * Created by mac on 6/15/16.
 */
public interface  QueueListener{

    public String getQueue();
    public void consumer(String message);
}
