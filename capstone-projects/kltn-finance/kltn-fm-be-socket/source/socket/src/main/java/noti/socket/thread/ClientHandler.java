package noti.socket.thread;

import io.netty.channel.ChannelHandlerContext;
import noti.common.json.Devices;
import noti.common.json.Message;
import noti.socket.cache.CacheSingleton;
import noti.socket.cmd.ResponseCode;
import noti.socket.constant.NotiConstant;
import noti.socket.constant.CacheKeyConstant;
import noti.socket.handler.MyChannelWSGroup;
import noti.socket.jwt.UserSession;
import noti.socket.model.ClientChannel;
import noti.socket.model.request.PollingLoginQrCode;
import noti.socket.model.request.SendMessageRequest;
import noti.socket.model.response.ClientInfoResponse;
import noti.socket.redis.RedisService;
import noti.socket.utils.SocketService;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ClientHandler {
    private static final Logger LOG = LogManager.getLogger(ClientHandler.class);
    private static ClientHandler instance = null;

    private ClientHandler() {

    }

    public static ClientHandler getInstance() {
        if (instance == null) {
            instance = new ClientHandler();
        }
        return instance;
    }

    private void sendErrorMsg(ChannelHandlerContext channelHandlerContext, Message oldRequest, String msg) {
        Message response = new Message();
        response.setCmd(oldRequest.getCmd());
        response.setMsg(msg);
        response.setResponseCode(ResponseCode.RESPONSE_CODE_ERROR);
        MyChannelWSGroup.getInstance().sendMessage(channelHandlerContext.channel(), response.toJson());
    }

    private boolean isValidSession(UserSession userSession) {
        if (userSession == null) {
            return false;
        }
        String username = userSession.getUsername();
        String tenantName = userSession.getTenantName();
        String grantType = userSession.getGrantType();
        String sessionId = userSession.getSessionId();
        String key = "";
        if (NotiConstant.GRANT_TYPE_EMPLOYEE.equals(grantType)) {
            key = RedisService.getInstance().getKeyString(CacheKeyConstant.KEY_EMPLOYEE, username, tenantName);
        } else if (NotiConstant.GRANT_TYPE_CUSTOMER.equals(grantType)) {
            key = RedisService.getInstance().getKeyString(CacheKeyConstant.KEY_CUSTOMER, username, tenantName);
        } else if (NotiConstant.GRANT_TYPE_PASSWORD.equals(grantType)) {
            key = RedisService.getInstance().getKeyString(CacheKeyConstant.KEY_ADMIN, username, null);
        } else {
            key = RedisService.getInstance().getKeyString(CacheKeyConstant.KEY_MOBILE, username, tenantName);
        }
        if (StringUtils.isNotBlank(key)) {
            return CacheSingleton.getInstance().checkSession(key, sessionId);
        }
        return false;
    }

    public void handlePing(ChannelHandlerContext channelHandlerContext, Message message) {
        UserSession userSession = UserSession.fromToken(message.getToken());
        if (isValidSession(userSession)) {
            hanldeCacheClientSession(userSession, channelHandlerContext);
            message.setData(new ClientInfoResponse());
            message.setToken(null);
            message.setMsg("Ping success with user: " + userSession.getUsername());
            message.setChannelId(MyChannelWSGroup.getInstance().getIdChannel(channelHandlerContext.channel()));
            message.setResponseCode(ResponseCode.RESPONSE_CODE_SUCCESS);
            MyChannelWSGroup.getInstance().sendMessage(channelHandlerContext.channel(), message.toJson());
            LOG.info("[Client Ping] Ping success with user: " + userSession.getUsername());
        } else {
            LOG.info("[Client Ping] Token invalid");
            message.setToken(null);
            sendErrorMsg(channelHandlerContext, message, "Token invalid");
        }
    }

    public void handleVerifyToken(ChannelHandlerContext channelHandlerContext, Message message) {
        UserSession userSession = UserSession.fromToken(message.getToken());
        if (isValidSession(userSession)) {
            hanldeCacheClientSession(userSession, channelHandlerContext);
            message.setData(new ClientInfoResponse());
            message.setToken(null);
            message.setMsg("Verify token success with user: " + userSession.getUsername());
            message.setChannelId(MyChannelWSGroup.getInstance().getIdChannel(channelHandlerContext.channel()));
            message.setResponseCode(ResponseCode.RESPONSE_CODE_SUCCESS);
            MyChannelWSGroup.getInstance().sendMessage(channelHandlerContext.channel(), message.toJson());
            LOG.info("[Client Verify Token] Verify token success with user: " + userSession.getUsername());
        } else {
            LOG.info("[Client Verify Token] Token invalid");
            message.setToken(null);
            sendErrorMsg(channelHandlerContext, message, "Token invalid");
        }
    }

    private void hanldeCacheClientSession(UserSession userSession, ChannelHandlerContext channelHandlerContext) {
        String clientChannelId;
        int keyType;
        Long userId = userSession.getId();
        String grantType = userSession.getGrantType();
        Integer userKind = userSession.getKind();
        String username = userSession.getUsername();
        String tenantName = userSession.getTenantName();
        if (NotiConstant.GRANT_TYPE_EMPLOYEE.equals(grantType)) {
            keyType = CacheKeyConstant.KEY_EMPLOYEE;
        } else if (NotiConstant.GRANT_TYPE_CUSTOMER.equals(grantType)) {
            keyType = CacheKeyConstant.KEY_CUSTOMER;
        } else if (NotiConstant.GRANT_TYPE_PASSWORD.equals(grantType)) {
            keyType = CacheKeyConstant.KEY_ADMIN;
        } else {
            keyType = CacheKeyConstant.KEY_MOBILE;
        }
        if (List.of(CacheKeyConstant.KEY_EMPLOYEE, CacheKeyConstant.KEY_MOBILE, CacheKeyConstant.KEY_CUSTOMER).contains(keyType)) {
            clientChannelId = keyType + "&" + username + "&" + userKind + "&" + tenantName;
        } else {
            clientChannelId = keyType + "&" + username + "&" + userKind;
        }
        ClientChannel channel = SocketService.getInstance().getClientChannel(clientChannelId);
        if (channel != null) {
            // update old channel
            channel.setTime(System.currentTimeMillis());
            channel.setChannelId(MyChannelWSGroup.getInstance().getIdChannel(channelHandlerContext.channel()));
        } else {
            // create new session
            ClientChannel clientChannel = new ClientChannel();
            if (StringUtils.isNotBlank(tenantName)) {
                clientChannel.setTenantName(tenantName);
            }
            clientChannel.setUserId(userId);
            clientChannel.setKeyType(keyType);
            clientChannel.setChannelId(MyChannelWSGroup.getInstance().getIdChannel(channelHandlerContext.channel()));
            clientChannel.setTime(System.currentTimeMillis());
            SocketService.getInstance().addClientChannel(clientChannelId, clientChannel);
        }
    }

    public void handlePollingLoginQrCode(ChannelHandlerContext channelHandlerContext, Message message) {
        PollingLoginQrCode form = message.getDataObject(PollingLoginQrCode.class);
        String clientId = form.getClientId();
        ClientChannel channel = SocketService.getInstance().getClientChannel(clientId);
        if (channel != null) {
            // update old channel
            channel.setTime(System.currentTimeMillis());
            channel.setChannelId(MyChannelWSGroup.getInstance().getIdChannel(channelHandlerContext.channel()));
        } else {
            // create new session
            ClientChannel clientChannel = new ClientChannel();
            clientChannel.setTenantName("LOGIN-QR-CODE-999");
            clientChannel.setUserId(-99999999L);
            clientChannel.setKeyType(-999);
            clientChannel.setChannelId(MyChannelWSGroup.getInstance().getIdChannel(channelHandlerContext.channel()));
            clientChannel.setTime(System.currentTimeMillis());
            SocketService.getInstance().addClientChannel(clientId, clientChannel);
        }
        message.setData(new ClientInfoResponse());
        message.setToken(null);
        message.setMsg("Polling success with client id: " + clientId);
        message.setChannelId(MyChannelWSGroup.getInstance().getIdChannel(channelHandlerContext.channel()));
        message.setResponseCode(ResponseCode.RESPONSE_CODE_SUCCESS);
        MyChannelWSGroup.getInstance().sendMessage(channelHandlerContext.channel(), message.toJson());
    }

    public Message createMessage(String cmd, String app, Object data, String msg, int responseCode) {
        Message message = new Message();
        message.setCmd(cmd);
        message.setApp(app);
        message.setData(data);
        message.setMsg(msg);
        message.setResponseCode(responseCode);
        return message;
    }

    public void handleBroadCastChatService(Message message) {
        SendMessageRequest request = message.getDataObject(SendMessageRequest.class);
        List<Long> userIds = request.getMemberIds();
        String tenant = request.getTenantName();

        if (userIds == null || tenant == null) {
            LOG.warn("[CHAT SERVICE] Missing tenant or memberIds");
            return;
        }

        request.setMemberIds(null);
        Message msg = createMessage(message.getCmd(), Devices.BACKEND_SOCKET_APP, request, "Broadcast success", ResponseCode.RESPONSE_CODE_SUCCESS);

        SocketService socketService = SocketService.getInstance();
        ConcurrentHashMap<String, ClientChannel> userChannels = socketService.getUserChannels();

        for (Map.Entry<String, ClientChannel> entry : userChannels.entrySet()) {
            ClientChannel channel = entry.getValue();
            if (channel == null) {
                continue;
            }

            boolean sameTenant = tenant.equals(channel.getTenantName());
            boolean isTargetUser = userIds.contains(channel.getUserId());
            Integer keyType = channel.getKeyType();
            boolean validKeyType = keyType != null && List.of(CacheKeyConstant.KEY_EMPLOYEE, CacheKeyConstant.KEY_MOBILE).contains(keyType);

            if (sameTenant && isTargetUser && validKeyType) {
                ClientChannel clientChannel = socketService.getClientChannel(entry.getKey());
                if (clientChannel != null) {
                    MyChannelWSGroup.getInstance().sendMessage(clientChannel.getChannelId(), msg.toJson());
                } else {
                    LOG.error("[CHAT SERVICE] Channel ID null for key: {}", entry.getKey());
                }
            }
        }
    }
}
