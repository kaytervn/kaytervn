package com.msa.dto.permission;

import com.msa.dto.ABasicAdminDto;
import lombok.Data;

@Data
public class PermissionDto extends ABasicAdminDto {
    private String name;
    private String nameGroup;
    private String permissionCode;
    private Integer kind;
}