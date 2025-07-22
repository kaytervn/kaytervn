package com.msa.socket.dto;

import com.msa.constant.SecurityConstant;
import lombok.Data;

import java.util.Objects;

@Data
public class LockDeviceRequest extends ABasicRequest {
    private String username;
    private Integer userKind;

    public String getChannelId() {
        if (Objects.equals(getUserKind(), SecurityConstant.USER_KIND_ADMIN)) {
            return username + "&" + userKind;
        }
        return username + "&" + userKind;
    }
}
