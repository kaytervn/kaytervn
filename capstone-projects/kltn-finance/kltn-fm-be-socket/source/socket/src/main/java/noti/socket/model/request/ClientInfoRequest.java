package noti.socket.model.request;

import lombok.Data;
import noti.socket.model.ABasicRequest;

@Data
public class ClientInfoRequest extends ABasicRequest {
    private String app;
}
