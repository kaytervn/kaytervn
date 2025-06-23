package noti.socket.thread;

import noti.socket.cmd.ResponseCode;
import noti.socket.handler.MyChannelWSGroup;
import noti.socket.model.ClientChannel;
import noti.socket.model.event.NotificationEvent;
import noti.socket.model.push.PushNotiRequest;
import noti.socket.model.request.LockDeviceDto;
import noti.socket.model.request.LockDeviceRequest;
import noti.socket.model.request.SendAccessTokenForm;
import noti.socket.utils.SocketService;
import org.apache.logging.log4j.Logger;
import noti.common.json.Devices;
import noti.common.json.Message;
import noti.socket.cmd.Command;
import noti.thread.AbstractRunable;

public class QueueThread extends AbstractRunable {
    private static final Logger LOG = org.apache.logging.log4j.LogManager.getLogger(QueueThread.class);
    private String data;

    public QueueThread(String data) {
        this.data = data;
    }

    public String getData() {
        return data;
    }

    public void run() {
        try {
            LOG.debug("BACKEND CALL =====> " + data);
            Message message = Message.fromJson(data, Message.class);
            if (message != null) {

                switch (message.getApp()) {
                    case Devices.BACKEND_APP:
                        handleBackendApp(message);
                        break;
                    default:
                        LOG.info("NO sub command process with: " + message.getSubCmd());
                }
            } else {
                LOG.error("message null or channel id null");
            }
        } catch (Exception e) {
            LOG.error(e.getMessage(), e);
        }
    }

    private void handleBackendApp(Message message) {
        switch (message.getCmd()) {
            case Command.BACKEND_POST_NOTIFICATION:
                handlePostNoti(message);
                break;
            case Command.CMD_LOCK_DEVICE:
                handleLockDevice(message);
                break;
            case Command.CMD_LOGIN_QR_CODE:
                handleLoginQrCode(message);
                break;
            case Command.CMD_CHAT_ROOM_CREATED:
            case Command.CMD_CHAT_ROOM_UPDATED:
            case Command.CMD_CHAT_ROOM_DELETED:
            case Command.CMD_NEW_MESSAGE:
            case Command.CMD_MESSAGE_UPDATED:
                ClientHandler.getInstance().handleBroadCastChatService(message);
                break;
            default:
                LOG.info("NO sub command process with: " + message.getSubCmd());
        }
    }

    /**
     * handlePostNoti
     * {
     * "cmd": "BACKEND_POST_NOTIFICATION",
     * "app": "BACKEND_APP",
     * "data": {
     * "kind": 1,
     * "app": "ELMS",
     * "message": "Noi dung msg here",
     * "userId": 1234,
     * "cmd": "BACKEND_POST_NOTIFICATION"
     * }
     * }
     */
    private void handlePostNoti(Message message) {
        NotificationEvent notificationEvent = message.getDataObject(NotificationEvent.class);
        if (notificationEvent != null && notificationEvent.getUserId() != null) {
            ClientChannel clientChannel = SocketService.getInstance().getClientChannel(notificationEvent.getUserId().toString());
            if (clientChannel != null) {
                PushNotiRequest pushNotiRequest = new PushNotiRequest();
                pushNotiRequest.setApp(notificationEvent.getApp());
                pushNotiRequest.setMessage(notificationEvent.getMessage());

                Message messagePost = new Message();
                messagePost.setCmd(Command.CLIENT_RECEIVED_PUSH_NOTIFICATION);
                messagePost.setApp(Devices.BACKEND_SOCKET_APP);
                messagePost.setResponseCode(ResponseCode.RESPONSE_CODE_SUCCESS);
                messagePost.setData(pushNotiRequest);

                MyChannelWSGroup.getInstance().sendMessage(clientChannel.getChannelId(), message.toJson());
            } else {
                LOG.debug("Not found user: {}", notificationEvent.getUserId());
            }
        }
    }

    private void handleLockDevice(Message message) {
        LockDeviceRequest lockDeviceRequest = message.getDataObject(LockDeviceRequest.class);
        ClientChannel clientChannel = SocketService.getInstance().getClientChannel(lockDeviceRequest.getChannelId());
        Message msg = ClientHandler.getInstance().createMessage(Command.CMD_LOCK_DEVICE, Devices.BACKEND_SOCKET_APP, lockDeviceRequest,
                "Lock account: " + lockDeviceRequest.getUsername(),
                ResponseCode.RESPONSE_CODE_SUCCESS);
        if (clientChannel != null) {
            MyChannelWSGroup.getInstance().sendMessage(clientChannel.getChannelId(), new LockDeviceDto(msg, lockDeviceRequest));
        } else {
            LOG.error("[LOCK DEVICE] Cannot send message to channel null");
        }
    }

    private void handleLoginQrCode(Message message) {
        SendAccessTokenForm form = message.getDataObject(SendAccessTokenForm.class);
        ClientChannel clientChannel = SocketService.getInstance().getClientChannel(form.getClientId());
        Message msg = ClientHandler.getInstance().createMessage(Command.CMD_LOGIN_QR_CODE, Devices.BACKEND_SOCKET_APP, form,
                "Verify login qr code success",
                ResponseCode.RESPONSE_CODE_SUCCESS);
        if (clientChannel != null) {
            MyChannelWSGroup.getInstance().sendMessage(clientChannel.getChannelId(), msg.toJson());
        } else {
            LOG.error("[LOGIN QR CODE] Cannot send message to channel null");
        }
    }
}
