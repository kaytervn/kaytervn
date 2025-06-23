package com.tenant.dto.project;

import com.tenant.dto.organization.OrganizationDto;
import com.tenant.dto.tag.TagDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ProjectDto {
    @ApiModelProperty(name = "id")
    private Long id;
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "organization")
    private OrganizationDto organization;
    @ApiModelProperty(name = "note")
    private String note;
    @ApiModelProperty(name = "tag")
    private TagDto tag;
}
