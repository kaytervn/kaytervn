package com.tenant.dto.serviceNotificationGroup;

import com.tenant.dto.ABasicAdminDto;
import com.tenant.dto.notificationGroup.NotificationGroupDto;
import com.tenant.dto.service.ServiceDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ServiceNotificationGroupAdminDto extends ABasicAdminDto {
    @ApiModelProperty(name = "service")
    private ServiceDto service;
    @ApiModelProperty(name = "notificationGroup")
    private NotificationGroupDto notificationGroup;
}
