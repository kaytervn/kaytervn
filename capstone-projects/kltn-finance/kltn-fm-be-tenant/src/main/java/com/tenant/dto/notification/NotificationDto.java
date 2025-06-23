package com.tenant.dto.notification;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Date;

@Data
public class NotificationDto {
    @ApiModelProperty(name = "id")
    private Long id;
    @ApiModelProperty(name = "message")
    private String message;
    @ApiModelProperty(name = "state")
    private Integer state;
    @ApiModelProperty(name = "serviceId")
    private Long serviceId;
    @ApiModelProperty(name = "accountId")
    private Long accountId;
    @ApiModelProperty(name = "createdDate")
    private Date createdDate;
}
