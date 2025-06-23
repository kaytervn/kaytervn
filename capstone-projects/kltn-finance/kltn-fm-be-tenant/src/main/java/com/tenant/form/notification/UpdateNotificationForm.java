package com.tenant.form.notification;

import com.tenant.validation.NotificationState;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class UpdateNotificationForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(name = "id", required = true)
    private Long id;
    @NotNull(message = "message cannot be null")
    @ApiModelProperty(name = "message", required = true)
    private String message;
    @NotificationState
    @NotNull(message = "state cannot be null")
    @ApiModelProperty(name = "state", required = true)
    private Integer state;
}
