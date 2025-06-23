package noti.socket.cmd;

import java.util.List;

public class Command {
    // Backend command
    public static final String BACKEND_POST_NOTIFICATION = "BACKEND_POST_NOTIFICATION";

    // CLIENT
    public static final String CLIENT_VERIFY_TOKEN = "CLIENT_VERIFY_TOKEN";
    public static final String CLIENT_PING = "CLIENT_PING";
    public static final String CLIENT_LOGIN_QR_CODE = "CLIENT_LOGIN_QR_CODE";
    public static final String CLIENT_CHAT_SERVICE = "CLIENT_CHAT_SERVICE";

    public static final String CMD_LOCK_DEVICE = "CMD_LOCK_DEVICE";
    public static final String CMD_LOGIN_QR_CODE = "CMD_LOGIN_QR_CODE";
    public static final String CLIENT_RECEIVED_PUSH_NOTIFICATION = "CLIENT_RECEIVED_PUSH_NOTIFICATION";
    public static final String TEST_CMD = "TEST_CMD";

    // CHAT SERVICE
    public static final String CMD_CHAT_ROOM_CREATED = "CMD_CHAT_ROOM_CREATED";
    public static final String CMD_CHAT_ROOM_UPDATED = "CMD_CHAT_ROOM_UPDATED";
    public static final String CMD_CHAT_ROOM_DELETED = "CMD_CHAT_ROOM_DELETED";
    public static final String CMD_NEW_MESSAGE = "CMD_NEW_MESSAGE";
    public static final String CMD_MESSAGE_UPDATED = "CMD_MESSAGE_UPDATED";

    public static final List<String> CHAT_LIST_CMD = List.of(
            CMD_CHAT_ROOM_CREATED,
            CMD_CHAT_ROOM_UPDATED,
            CMD_CHAT_ROOM_DELETED,
            CMD_NEW_MESSAGE,
            CMD_MESSAGE_UPDATED
    );

    public static boolean ignoreToken(String cmd) {
        return List.of(
                TEST_CMD,
                CLIENT_LOGIN_QR_CODE
        ).contains(cmd);
    }
}
