package com.base.auth.dto.settings;

import com.base.auth.dto.ABasicAdminDto;
import lombok.Data;

@Data
public class SettingsDto extends ABasicAdminDto {
    private String settingKey;
    private String settingValue;
    private String groupName;
    private String description;
    private Integer isSystem;
    private Integer isEditable;
}
