package noti.socket.thread;

import noti.socket.utils.SocketService;
import org.apache.logging.log4j.Logger;

import java.util.TimerTask;

public class CleanupClientChannel extends TimerTask {
    private static final Logger LOG = org.apache.logging.log4j.LogManager.getLogger(CleanupClientChannel.class);

    @Override
    public void run() {
        LOG.warn("#############============>XXXX Clean up key");
        SocketService.getInstance().scanAndRemoveChannel();
        LOG.warn("#############============>XXXX Clean up key Done. Size: "+SocketService.getInstance().countChannelOrder());
    }
}
