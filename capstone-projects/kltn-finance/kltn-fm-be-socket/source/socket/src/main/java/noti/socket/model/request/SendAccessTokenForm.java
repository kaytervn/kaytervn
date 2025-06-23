package noti.socket.model.request;

import lombok.Data;

@Data
public class SendAccessTokenForm {
    private String accessToken;
    private String clientId;
}
