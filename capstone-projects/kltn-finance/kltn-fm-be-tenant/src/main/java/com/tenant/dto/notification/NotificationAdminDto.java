package com.tenant.dto.notification;

import com.tenant.dto.ABasicAdminDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class NotificationAdminDto extends ABasicAdminDto {
    @ApiModelProperty(name = "message")
    private String message;
    @ApiModelProperty(name = "state")
    private Integer state;
    @ApiModelProperty(name = "serviceId")
    private Long serviceId;
    @ApiModelProperty(name = "accountId")
    private Long accountId;
}
