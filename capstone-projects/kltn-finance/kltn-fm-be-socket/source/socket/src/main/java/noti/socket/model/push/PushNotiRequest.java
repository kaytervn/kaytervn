package noti.socket.model.push;

import lombok.Data;
import noti.socket.model.ABasicPushRequest;
import noti.socket.model.ABasicRequest;

@Data
public class PushNotiRequest extends ABasicPushRequest {
    private String message;
    private String app;
    private Integer kind;
}
