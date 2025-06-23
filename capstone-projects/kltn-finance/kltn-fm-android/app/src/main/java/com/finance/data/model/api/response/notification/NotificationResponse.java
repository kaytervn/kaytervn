package com.finance.data.model.api.response.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String message;
    private Long serviceId;
    private Long accountId;
    private Integer state;
    private String createdDate;
}
