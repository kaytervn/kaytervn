package com.finance.data.model.api.request.project;

import com.finance.data.model.api.response.project.ProjectResponse;
import com.finance.data.model.api.response.tag.TagResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectUpdateRequest {
    Long id;
    String name;
    String logo;
    String note;
    Long organizationId;
    Long tagId;
    public ProjectUpdateRequest(ProjectResponse projectResponse) {
        this.id = projectResponse.getId();
        this.name = projectResponse.getName();
        this.logo = projectResponse.getLogo();
        this.note = projectResponse.getNote();
        if (projectResponse.getOrganization() != null)
            this.organizationId = projectResponse.getOrganization().getId();
        if (projectResponse.getTag() != null)
            this.tagId = projectResponse.getTag().getId();
    }
}
