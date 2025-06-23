package com.tenant.dto.notification;

import lombok.Data;

import java.util.List;

@Data
public class MyNotificationDto {
    private List<NotificationDto> content ;
    private Long totalUnread;
    private long totalElements;
    private long totalPages;
}
