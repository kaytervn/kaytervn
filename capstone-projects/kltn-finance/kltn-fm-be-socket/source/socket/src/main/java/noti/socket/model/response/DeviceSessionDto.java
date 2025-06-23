package noti.socket.model.response;

import lombok.Data;

import java.util.Date;

@Data
public class DeviceSessionDto {
    private Date time;
    private String session;
    private String employee;
}
