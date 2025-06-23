package com.tenant.dto.task;

import com.tenant.dto.ABasicAdminDto;
import com.tenant.dto.project.ProjectDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class TaskAdminDto extends ABasicAdminDto {
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "state")
    private Integer state;
    @ApiModelProperty(name = "note")
    private String note;
    @ApiModelProperty(name = "document")
    private String document;
    @ApiModelProperty(name = "project")
    private ProjectDto project;
    @ApiModelProperty(name = "parent")
    private TaskDto parent;
    @ApiModelProperty(name = "totalChildren")
    private Integer totalChildren;
}
