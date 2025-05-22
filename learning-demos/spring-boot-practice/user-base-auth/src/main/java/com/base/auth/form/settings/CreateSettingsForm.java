package com.base.auth.form.settings;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
@ApiModel
public class CreateSettingsForm {
    @NotEmpty(message = "settingKey cant not be null")
    @ApiModelProperty(name = "settingKey", required = true)
    private String settingKey;

    @NotEmpty(message = "settingValue cant not be null")
    @ApiModelProperty(name = "settingValue", required = true)
    private String settingValue;

    @NotEmpty(message = "groupName cant not be null")
    @ApiModelProperty(name = "groupName", required = true)
    private String groupName;

    @ApiModelProperty(name = "description")
    private String description;

    @NotNull(message = "isSystem cant not be null")
    @ApiModelProperty(name = "isSystem", required = true)
    private Integer isSystem;

    @NotNull(message = "isEditable cant not be null")
    @ApiModelProperty(name = "isEditable", required = true)
    private Integer isEditable;

    @NotNull(message = "status can not be null")
    @ApiModelProperty(required = true)
    private Integer status;
}
