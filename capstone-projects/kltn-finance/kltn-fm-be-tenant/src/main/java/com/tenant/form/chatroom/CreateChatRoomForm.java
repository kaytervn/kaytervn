package com.tenant.form.chatroom;

import com.tenant.dto.chatroom.settings.SettingJsonFormat;
import com.tenant.validation.ValidJsonField;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.*;

@Data
public class CreateChatRoomForm {
    @NotBlank(message = "name cannot be blank")
    @ApiModelProperty(required = true)
    private String name;
    private String avatar;
    @NotEmpty(message="memberIds can not be empty")
    @ApiModelProperty(required = true)
    @Size(min = 2)
    private List<Long> memberIds = new ArrayList<>();
    @NotBlank(message = "settings cannot be blank")
    @ValidJsonField(classType = SettingJsonFormat.class)
    @ApiModelProperty(required = true)
    private String settings;

}