package com.tenant.form.notification;

import com.tenant.validation.NotificationState;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class CreateNotificationForm {
    @NotNull(message = "message cannot be null")
    @ApiModelProperty(name = "message", required = true)
    private String message;
    @NotificationState
    @NotNull(message = "state cannot be null")
    @ApiModelProperty(name = "state", required = true)
    private Integer state;
    @NotNull(message = "serviceId cannot be null")
    @ApiModelProperty(name = "serviceId", required = true)
    private Long serviceId;
    @NotNull(message = "accountId cannot be null")
    @ApiModelProperty(name = "accountId", required = true)
    private Long accountId;
}
