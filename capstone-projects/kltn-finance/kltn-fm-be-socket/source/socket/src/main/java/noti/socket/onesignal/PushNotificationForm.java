package noti.socket.onesignal;

import lombok.Data;

import java.util.List;

@Data
public class PushNotificationForm<T> {
    private String appId;
    private ContentsDto contents;
    private List<String> includedPlayerIds;
    private T data;
}
