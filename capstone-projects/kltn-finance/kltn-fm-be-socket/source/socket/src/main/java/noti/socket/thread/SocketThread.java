package noti.socket.thread;

import io.netty.channel.ChannelHandlerContext;
import lombok.Data;
import org.apache.logging.log4j.Logger;
import noti.common.json.Devices;
import noti.common.json.Message;
import noti.socket.cmd.Command;
import noti.socket.cmd.ResponseCode;
import noti.socket.handler.MyChannelWSGroup;
import noti.thread.AbstractRunable;

import java.util.List;

@Data
public class SocketThread extends AbstractRunable {
    private static final Logger LOG = org.apache.logging.log4j.LogManager.getLogger(SocketThread.class);
    private String msg;
    private ChannelHandlerContext channelHandlerContext;

    public SocketThread(String message, ChannelHandlerContext channelHandlerContext) {
        this.msg = message;
        this.channelHandlerContext = channelHandlerContext;
    }

    @Override
    public void run() {
        //gui vao queue de schedule lai
        Message message = Message.fromJson(msg, Message.class);
        //LOG.debug("msg: "+msg);
        if (message != null) {
            if (Command.CHAT_LIST_CMD.contains(message.getCmd())) {
                ClientHandler.getInstance().handleBroadCastChatService(message);
            } else if (message.getToken() == null && !Command.ignoreToken(message.getCmd())) {
                sendUnauthMsg(message);
                LOG.debug("Token require...");
            } else {
                switch (message.getApp()) {
                    case Devices.CLIENT_APP:
                        handleClientApp(message);
                        break;
                    default:
                        sendErrorMsg(message);
                        break;
                }
            }
        } else {
            LOG.debug("data error " + msg + " is not json format");
        }
    }

    private void handleClientApp(Message message) {
        switch (message.getCmd()) {
            case Command.CLIENT_PING:
                ClientHandler.getInstance().handlePing(channelHandlerContext, message);
                break;
            case Command.CLIENT_VERIFY_TOKEN:
                ClientHandler.getInstance().handleVerifyToken(channelHandlerContext, message);
                break;
            case Command.CLIENT_LOGIN_QR_CODE:
                ClientHandler.getInstance().handlePollingLoginQrCode(channelHandlerContext, message);
                break;
            default:
                sendErrorMsg(message);
                break;
        }
    }

    private void sendErrorMsg(Message oldRequest) {
        Message response = new Message();
        response.setCmd(oldRequest.getCmd());
        response.setMsg("Data error");
        response.setResponseCode(ResponseCode.RESPONSE_CODE_ERROR);
        MyChannelWSGroup.getInstance().sendMessage(channelHandlerContext.channel(), response.toJson());
    }

    private void sendUnauthMsg(Message oldRequest) {
        Message response = new Message();
        response.setCmd(oldRequest.getCmd());
        response.setMsg("Data error");
        response.setResponseCode(ResponseCode.RESPONSE_CODE_UN_AUTH);
        MyChannelWSGroup.getInstance().sendMessage(channelHandlerContext.channel(), response.toJson());
    }
}
