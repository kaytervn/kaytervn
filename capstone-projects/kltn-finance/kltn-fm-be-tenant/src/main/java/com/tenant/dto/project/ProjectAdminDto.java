package com.tenant.dto.project;

import com.tenant.dto.ABasicAdminDto;
import com.tenant.dto.organization.OrganizationDto;
import com.tenant.dto.tag.TagDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ProjectAdminDto extends ABasicAdminDto {
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "logo")
    private String logo;
    @ApiModelProperty(name = "organization")
    private OrganizationDto organization;
    @ApiModelProperty(name = "totalTasks")
    private Integer totalTasks;
    @ApiModelProperty(name = "note")
    private String note;
    @ApiModelProperty(name = "tag")
    private TagDto tag;
}