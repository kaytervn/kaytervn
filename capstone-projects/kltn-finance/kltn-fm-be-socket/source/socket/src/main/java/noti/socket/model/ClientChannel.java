package noti.socket.model;

import lombok.Data;

@Data
public class ClientChannel {
    private String channelId;
    private Integer keyType;
    private String tenantName;
    private Long userId;
    private Long time;
}
