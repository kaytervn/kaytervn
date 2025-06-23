package noti.socket.handler;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Created by mac on 5/25/16.
 */
public class TCPServerHandler extends SimpleChannelInboundHandler<String> {
    private final static Logger LOG = LogManager.getLogger(TCPServerHandler.class.getName());



    @Override
    public void channelRead0(ChannelHandlerContext ctx, String msg) throws Exception {
        //System.out.println("received message from tcp: "+msg);
        LOG.info("received message from tcp: "+msg);
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        LOG.info("channelActive");
        super.channelActive(ctx);
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        LOG.info("channelInactive");
        super.channelInactive(ctx);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        LOG.error(cause.getMessage(), cause);
        super.exceptionCaught(ctx, cause);
    }
}


        /*extends ChannelInboundHandlerAdapter {

    private static final Logger LOG = LogManager.getLogger(TCPServerHandler.class);

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        super.channelActive(ctx);
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        super.channelInactive(ctx);
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        String json = (String)msg;
        LOG.info("message received: "+json);
        super.channelRead(ctx, msg);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        super.exceptionCaught(ctx, cause);
    }*/

