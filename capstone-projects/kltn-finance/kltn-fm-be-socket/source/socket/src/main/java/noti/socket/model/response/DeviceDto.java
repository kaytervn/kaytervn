package noti.socket.model.response;

import lombok.Data;
import noti.socket.model.ABasicModel;

@Data
public class DeviceDto extends ABasicModel {
    private String posId;
    private Integer type;
    private String tenant;
    private String time;
    private String session;
}
