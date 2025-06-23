package noti.socket.handler;

import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.timeout.IdleStateEvent;

/**
 * Created by mac on 9/29/16.
 */
public class HeartbeatHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        System.out.println("HeartbeatHandler>>userEventTriggered");
        if (evt instanceof IdleStateEvent) {
            System.out.println("HeartbeatHandler>>userEventTriggered>>close on failure");
            ctx.writeAndFlush(new TextWebSocketFrame("{\"cmd\":\"PING\",\"subCmd\":\"PING\"}")).addListener(ChannelFutureListener.CLOSE_ON_FAILURE);  //3
            //ctx.close();
        } else {
            super.userEventTriggered(ctx, evt);  //4
        }
    }
}
