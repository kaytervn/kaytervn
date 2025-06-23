package com.tenant.dto.group;

import com.tenant.dto.ABasicAdminDto;
import com.tenant.dto.permission.GroupPermissionDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

@Data
public class GroupAdminDto extends ABasicAdminDto {
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "description")
    private String description;
    @ApiModelProperty(name = "groupPermissions")
    private List<GroupPermissionDto> groupPermissions;
    private Object role;
}
