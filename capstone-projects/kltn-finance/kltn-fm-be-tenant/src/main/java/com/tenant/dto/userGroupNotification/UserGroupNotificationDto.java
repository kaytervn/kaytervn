package com.tenant.dto.userGroupNotification;

import com.tenant.dto.account.AccountDto;
import com.tenant.dto.notificationGroup.NotificationGroupDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class UserGroupNotificationDto {
    @ApiModelProperty(name = "id")
    private Long id;
    @ApiModelProperty(name = "account")
    private AccountDto account;
    @ApiModelProperty(name = "notificationGroup")
    private NotificationGroupDto notificationGroup;
}
