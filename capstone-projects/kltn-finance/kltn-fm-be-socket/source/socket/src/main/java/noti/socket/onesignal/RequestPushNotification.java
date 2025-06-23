package noti.socket.onesignal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestPushNotification {
    private String title;
    private String content;
    private String playerId;
    private String appName;
}
