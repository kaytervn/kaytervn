package com.finance.data.model.api.response.chat;

import com.google.gson.annotations.SerializedName;

import lombok.Data;

@Data
public class SettingChat {
    @SerializedName("member_permissions")
    private MemberPermission memberPermissions;
}
