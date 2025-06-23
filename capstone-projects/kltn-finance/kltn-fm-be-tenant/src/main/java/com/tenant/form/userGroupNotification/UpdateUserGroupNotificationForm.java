package com.tenant.form.userGroupNotification;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class UpdateUserGroupNotificationForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(name = "id", required = true)
    private Long id;
    @NotNull(message = "accountId cannot be null")
    @ApiModelProperty(name = "accountId", required = true)
    private Long accountId;
    @NotNull(message = "notificationGroupId cannot be null")
    @ApiModelProperty(name = "notificationGroupId", required = true)
    private Long notificationGroupId;
}
