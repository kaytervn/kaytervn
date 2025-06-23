package com.tenant.dto.chatroom.settings;

import lombok.Data;

import javax.validation.Valid;

@Data
public class SettingJsonFormat {
    @Valid
    private MemberPermissionDto member_permissions;
}
