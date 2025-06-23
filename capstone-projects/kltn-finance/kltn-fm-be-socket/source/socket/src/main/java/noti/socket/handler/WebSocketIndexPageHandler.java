package noti.socket.handler;

/**
 * Created by mac on 5/22/16.
 */

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.FullHttpRequest;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Outputs index page content.
 */
public class WebSocketIndexPageHandler extends SimpleChannelInboundHandler<FullHttpRequest> {
    private final static Logger LOG = LogManager.getLogger(WebSocketIndexPageHandler.class.getName());
    private final String websocketPath;

    public WebSocketIndexPageHandler(String websocketPath) {
        this.websocketPath = websocketPath;
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest req) throws Exception {
        // Handle a bad request
//        final Map<String, Object> bindings = new HashMap<>();
//        bindings.put("ctx", ctx);
//        bindings.put("req", req);
//        bindings.put("channels", MyChannelWSGroup.getInstance());
//        bindings.put("websocketPath", websocketPath);
//        ScriptController.getInstance().execHttp(bindings);
        // Allow only GET methods.

    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        cause.printStackTrace();
        ctx.close();
    }




}