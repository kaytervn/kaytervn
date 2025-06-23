package com.finance.data.model.api.request.chat;

import com.finance.data.model.api.ApiModelUtils;
import com.finance.data.model.api.response.chat.SettingChat;

import lombok.Data;

@Data
public class ChatRoomUpdateRequest {
    private Long id;
    private String name;
    private String avatar;
    private String settings;

    public SettingChat getSettings() {
        if (settings == null || settings.isEmpty()) {
            return new SettingChat();
        }
        try {
            return ApiModelUtils.fromJson(settings, SettingChat.class);
        } catch (Exception e) {
            return new SettingChat();
        }
    }
}
