package com.finance.data.model.api.response.chat;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Group {
    private String description;
    private int id;
    private boolean isSystemRole;
    private int kind;
    private String name;
    private List<PermissionChat> permissions;
}
