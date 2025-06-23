package noti.socket;

/**
 * Created by mac on 5/22/16.
 */

import noti.socket.queue.RabbitMqSingleton;
import noti.socket.thread.CleanupClientChannel;
import noti.socket.thread.ActiveScheduler;
import noti.socket.utils.SnowFlakeIdService;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;
import noti.socket.utils.QueueService;
import noti.socket.utils.SocketService;

import java.util.TimeZone;

/**
 * A HTTP server which serves Web Socket requests at:
 *
 * http://localhost:8080/websocket
 *
 * Open your browser at http://localhost:8080/, then the demo page will be loaded and a Web Socket connection will be
 * made automatically.
 *
 * This server illustrates support for the different web socket specification versions and will work with:
 *
 * <ul>
 * <li>Safari 5+ (draft-ietf-hybi-thewebsocketprotocol-00)
 * <li>Chrome 6-13 (draft-ietf-hybi-thewebsocketprotocol-00)
 * <li>Chrome 14+ (draft-ietf-hybi-thewebsocketprotocol-10)
 * <li>Chrome 16+ (RFC 6455 aka draft-ietf-hybi-thewebsocketprotocol-17)
 * <li>Firefox 7+ (draft-ietf-hybi-thewebsocketprotocol-10)
 * <li>Firefox 11+ (RFC 6455 aka draft-ietf-hybi-thewebsocketprotocol-17)
 * </ul>
 */
public final class WebSocketServer {

    public static final int PORT = Integer.valueOf(QueueService.getInstance().getStringResource("server.ws.port"));
    public static void main(String[] args) throws Exception {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));   // It will set UTC timezone

        //start queue
        RabbitMqSingleton.getInstance().startQueue();

        //cleanup key order
        SocketService.getInstance().getTimer().scheduleAtFixedRate(new CleanupClientChannel(), 10000, 60000);

        //init snow flake
        SnowFlakeIdService.getInstance().setDataCenterId(0);
        SnowFlakeIdService.getInstance().setNodeId(0);

        EventLoopGroup bossGroup = new NioEventLoopGroup(1);
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            ServerBootstrap b = new ServerBootstrap();
            b.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .handler(new LoggingHandler(LogLevel.INFO))
                    .childHandler(new WebSocketServerInitializer());

            Channel ch = b.bind(PORT).sync().channel();
            System.out.println("Websocket server started successfully Open your web browser and navigate to http://127.0.0.1:" + PORT + '/');

            // Start ping scheduler
            ActiveScheduler activeScheduler = new ActiveScheduler();
            activeScheduler.start();

            ch.closeFuture().sync();
        } finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }
}
