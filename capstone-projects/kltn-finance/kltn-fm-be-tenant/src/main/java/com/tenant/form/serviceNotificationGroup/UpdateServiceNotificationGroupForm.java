package com.tenant.form.serviceNotificationGroup;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class UpdateServiceNotificationGroupForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(name = "id", required = true)
    private Long id;
    @NotNull(message = "serviceId cannot be null")
    @ApiModelProperty(name = "serviceId", required = true)
    private Long serviceId;
    @NotNull(message = "notificationGroupId cannot be null")
    @ApiModelProperty(name = "notificationGroupId", required = true)
    private Long notificationGroupId;
}
