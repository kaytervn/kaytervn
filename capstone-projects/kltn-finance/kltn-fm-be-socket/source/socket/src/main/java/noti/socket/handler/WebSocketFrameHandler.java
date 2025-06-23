package noti.socket.handler;

import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.ContinuationWebSocketFrame;
import io.netty.handler.codec.http.websocketx.PingWebSocketFrame;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketFrame;
import io.netty.handler.timeout.IdleStateEvent;
import org.apache.logging.log4j.Logger;
import noti.socket.thread.SocketThread;
import noti.socket.utils.SocketService;


public class WebSocketFrameHandler extends SimpleChannelInboundHandler<WebSocketFrame> {

    private static final Logger LOG = org.apache.logging.log4j.LogManager.getLogger(WebSocketFrameHandler.class);
    private StringBuilder partialText = new StringBuilder();

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, WebSocketFrame frame) throws Exception {
        // ping and pong frames already handled
        if (frame instanceof TextWebSocketFrame) {
            try {
                String request = ((TextWebSocketFrame) frame).text();
                if(((TextWebSocketFrame) frame).isFinalFragment()){
                    processingRequest(request, ctx);
                }else{
                    partialText.append(request);
                }
            }catch (Exception e){
                LOG.error("Error received {}", ctx.channel());
            }
        }else if (frame instanceof ContinuationWebSocketFrame) {
            try{
                ContinuationWebSocketFrame continuationFrame = (ContinuationWebSocketFrame) frame;
                partialText.append(continuationFrame.text());
                if (continuationFrame.isFinalFragment()) {
                    processingRequest(partialText.toString(), ctx);
                    partialText.setLength(0);
                }
            }catch (Exception e){
                LOG.error("Error received {}", ctx.channel());
            }
        }
    }

    private void processingRequest(String msg, ChannelHandlerContext ctx){

        SocketThread socketThread = new SocketThread(msg, ctx);
        SocketService.getInstance().getWorkerPool().executeThread(socketThread);
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        MyChannelWSGroup.getInstance().addChannel(ctx.channel());
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        LOG.error(cause.getMessage(), cause);
        MyChannelWSGroup.getInstance().removeChannel(ctx.channel());
        ctx.close();
    }


    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        MyChannelWSGroup.getInstance().removeChannel(ctx.channel());
        ctx.close();
        super.channelInactive(ctx);
    }


//    /**
//     *
//     * ALL_IDLE => No data was either received or sent for a while.
//     * READER_IDLE => No data was received for a while.
//     * WRITER_IDLE => No data was sent for a while.
//     *
//     * */
    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {

        if (evt instanceof IdleStateEvent) {
            //send 1 ping to detect channel live or die
            if(!ctx.channel().isOpen() || !ctx.channel().isActive()){
                ctx.close();
            }else {
                ctx.writeAndFlush(new PingWebSocketFrame()).addListener(ChannelFutureListener.CLOSE_ON_FAILURE);  //3
            }
        }else{
            super.userEventTriggered(ctx,evt);
        }

    }

}