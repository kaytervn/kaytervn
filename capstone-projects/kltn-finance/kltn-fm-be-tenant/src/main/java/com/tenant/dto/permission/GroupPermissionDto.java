package com.tenant.dto.permission;

import com.tenant.dto.ABasicAdminDto;
import com.tenant.dto.group.GroupDto;
import lombok.Data;

@Data
public class GroupPermissionDto extends ABasicAdminDto {
    private GroupDto group;
    private Long permissionId;
}
