package com.msa.dto.group;

import com.msa.dto.ABasicAdminDto;
import com.msa.dto.permission.PermissionDto;
import lombok.Data;

import java.util.List;

@Data
public class GroupDto extends ABasicAdminDto {
    private String name;
    private Integer kind;
    private Boolean isSystem;
    private List<PermissionDto> permissions;
}