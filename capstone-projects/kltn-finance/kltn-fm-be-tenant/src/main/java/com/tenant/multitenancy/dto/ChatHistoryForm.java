package com.tenant.multitenancy.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ChatHistoryForm {
    private String role;
    private List<PartDto> parts = new ArrayList<>();
}
