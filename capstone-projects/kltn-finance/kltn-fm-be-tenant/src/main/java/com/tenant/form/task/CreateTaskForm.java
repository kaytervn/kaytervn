package com.tenant.form.task;

import com.tenant.validation.TaskState;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class CreateTaskForm {
    @NotBlank(message = "name cannot be null")
    @ApiModelProperty(name = "name", required = true)
    private String name;
    @ApiModelProperty(name = "note")
    private String note;
    @NotNull(message = "state cannot be null")
    @TaskState
    @ApiModelProperty(name = "state", required = true)
    private Integer state;
    @ApiModelProperty(name = "document")
    private String document;
    @NotNull(message = "projectId cannot be null")
    @ApiModelProperty(name = "projectId", required = true)
    private Long projectId;
    @ApiModelProperty(name = "parentId")
    private Long parentId;
}
