package noti.socket.model.request;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class SendMessageRequest {
    private Long chatRoomId;
    private String tenantName;
    private Long messageId;
    private List<Long> memberIds = new ArrayList<>();
}
