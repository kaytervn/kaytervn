package noti.socket.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import noti.common.json.Message;
import noti.socket.model.ABasicRequest;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LockDeviceDto extends ABasicRequest {
    private Message message;
    private LockDeviceRequest lockDeviceRequest;
}
