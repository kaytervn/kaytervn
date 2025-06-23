package com.finance.data.model.api.request.task;

import com.finance.data.model.api.response.task.TaskResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskUpdateRequest {
    private Long id;
    private String name;
    private String note;
    private Long projectId;
    private Long parentId;
    private Integer state = 1;
    private String document;

    public TaskUpdateRequest(TaskResponse taskResponse) {
        this.id = taskResponse.getId();
        this.name = taskResponse.getName();
        this.note = taskResponse.getNote();
        this.state = taskResponse.getState();
        this.document = taskResponse.getDocument();
        if (taskResponse.getProject() != null) {
            this.projectId = taskResponse.getProject().getId();
        }
        if (taskResponse.getParent() != null) {
            this.parentId = taskResponse.getParent().getId();
        }
    }
}
