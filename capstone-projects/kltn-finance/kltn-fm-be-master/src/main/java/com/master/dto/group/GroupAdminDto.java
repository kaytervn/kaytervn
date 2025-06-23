package com.master.dto.group;

import com.master.dto.ABasicAdminDto;
import com.master.dto.permission.PermissionDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

@Data
public class GroupAdminDto extends ABasicAdminDto {
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "description")
    private String description;
    @ApiModelProperty(name = "kind")
    private Integer kind;
    @ApiModelProperty(name = "permissions")
    private List<PermissionDto> permissions ;
}
