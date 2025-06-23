package com.finance.data.model.api.response.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PermissionChat {
    private String action;
    private int id;
    private boolean isSystem;
    private String name;
    private String nameGroup;
    private String permissionCode;
}
