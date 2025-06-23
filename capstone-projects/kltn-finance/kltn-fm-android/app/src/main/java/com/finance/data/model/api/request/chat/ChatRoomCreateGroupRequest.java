package com.finance.data.model.api.request.chat;

import com.finance.data.model.api.ApiModelUtils;
import com.finance.data.model.api.response.chat.SettingChat;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomCreateGroupRequest {
    String avatar;
    List<Long> memberIds;
    String name;
    String settings;

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
