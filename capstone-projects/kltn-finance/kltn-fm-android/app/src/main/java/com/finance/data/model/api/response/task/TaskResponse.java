package com.finance.data.model.api.response.task;

import com.finance.data.model.api.response.project.ProjectResponse;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse implements Serializable {
    private Long id;
    private String name;
    private String note;
    private Integer state;
    private String createdDate;
    private ProjectResponse project;
    private String document;
    private TaskResponse parent;
    private Integer totalChildren;

    public void setTaskResponse(TaskResponse taskResponse) {
        this.id = taskResponse.getId();
        this.name = taskResponse.getName();
        this.note = taskResponse.getNote();
        this.state = taskResponse.getState();
        this.createdDate = taskResponse.getCreatedDate();
        if (taskResponse.getProject() != null)
            this.project = taskResponse.getProject();
        if (taskResponse.getDocument() != null)
            this.document = taskResponse.getDocument();
        if (taskResponse.getParent() != null)
            this.parent = taskResponse.getParent();
        this.totalChildren = taskResponse.getTotalChildren();
    }
}
