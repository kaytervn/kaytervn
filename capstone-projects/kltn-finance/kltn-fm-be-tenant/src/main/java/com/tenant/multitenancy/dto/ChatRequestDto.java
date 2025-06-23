package com.tenant.multitenancy.dto;

import lombok.Data;

import java.util.List;

@Data
public class ChatRequestDto {
    private List<ChatHistoryForm> history;
    private String message;
}