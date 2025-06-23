package noti.socket.model.response;

import lombok.Data;
import noti.socket.model.ABasicResponse;

@Data
public class LockDeviceResponse extends ABasicResponse {
    private String posId;
    private Integer deviceType;
    private String tenantName;
}
