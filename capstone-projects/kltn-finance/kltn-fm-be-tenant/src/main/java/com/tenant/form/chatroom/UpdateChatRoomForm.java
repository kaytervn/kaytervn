package com.tenant.form.chatroom;

import com.tenant.dto.chatroom.settings.SettingJsonFormat;
import com.tenant.validation.ValidJsonField;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class UpdateChatRoomForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(required = true)
    private Long id;
    private String name;
    private String avatar;
    @ValidJsonField(classType = SettingJsonFormat.class, allowNull = true)
    private String settings;
}