package com.tenant.dto.taskPermission;

import com.tenant.dto.account.AccountDto;
import com.tenant.dto.task.TaskDto;
import com.tenant.dto.project.ProjectDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class TaskPermissionDto {
    @ApiModelProperty(name = "id")
    private Long id;
    @ApiModelProperty(name = "permissionKind")
    private Integer permissionKind;
    @ApiModelProperty(name = "account")
    private AccountDto account;
    @ApiModelProperty(name = "task")
    private TaskDto task;
    @ApiModelProperty(name = "project")
    private ProjectDto project;
}
