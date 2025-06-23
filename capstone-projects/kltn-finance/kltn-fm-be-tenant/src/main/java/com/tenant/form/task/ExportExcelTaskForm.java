package com.tenant.form.task;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class ExportExcelTaskForm {
    @NotNull(message = "taskIds cannot be null")
    @ApiModelProperty(name = "taskIds", required = true)
    private List<Long> taskIds;
}
