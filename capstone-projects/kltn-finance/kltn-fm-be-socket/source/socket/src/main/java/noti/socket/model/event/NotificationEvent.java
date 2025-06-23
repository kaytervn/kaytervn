package noti.socket.model.event;

import lombok.Data;
import noti.socket.model.ABasicModel;

@Data
public class NotificationEvent extends ABasicModel {
    private String message;
    private String app;
    private Integer kind;
    private Long userId;
}
