package com.tenant.dto.serviceNotificationGroup;

import com.tenant.dto.notificationGroup.NotificationGroupDto;
import com.tenant.dto.service.ServiceDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ServiceNotificationGroupDto {
    @ApiModelProperty(name = "id")
    private Long id;
    @ApiModelProperty(name = "service")
    private ServiceDto service;
    @ApiModelProperty(name = "notificationGroup")
    private NotificationGroupDto notificationGroup;
}
