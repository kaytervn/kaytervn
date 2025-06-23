package com.finance.data.model.api.response.project;

import com.finance.data.model.api.response.organization.OrganizationResponse;
import com.finance.data.model.api.response.tag.TagResponse;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse implements Serializable {
    private Long id;
    private String name;
    private String logo;
    private OrganizationResponse organization;
    private Integer totalTasks;
    private String note;
    private TagResponse tag = new TagResponse();

    public ProjectResponse(Long id, String name, String logo, OrganizationResponse organization, Integer totalTasks) {
        this.id = id;
        this.name = name;
        this.logo = logo;
        this.organization = organization;
        this.totalTasks = totalTasks;
    }
}
