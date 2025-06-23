package noti.socket.model.request;

import lombok.Data;
import noti.socket.constant.CacheKeyConstant;
import noti.socket.model.ABasicRequest;

@Data
public class LockDeviceRequest extends ABasicRequest {
    private String app;
    private Integer keyType;
    private String username;
    private Integer userKind;
    private String tenantName;

    public String getChannelId() {
        switch (getKeyType()) {
            case CacheKeyConstant.KEY_ADMIN:
                return keyType + "&" + username + "&" + userKind;
            case CacheKeyConstant.KEY_CUSTOMER:
            case CacheKeyConstant.KEY_EMPLOYEE:
            case CacheKeyConstant.KEY_MOBILE:
                return keyType + "&" + username + "&" + userKind + "&" + tenantName;
            default:
                return null;
        }
    }
}
