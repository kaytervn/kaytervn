package com.tenant.form.project;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CreateProjectForm {
    @NotBlank(message = "name cannot be null")
    @ApiModelProperty(name = "name", required = true)
    private String name;
    @ApiModelProperty(name = "logo")
    private String logo;
    @ApiModelProperty(name = "note")
    private String note;
    @ApiModelProperty(name = "organizationId")
    private Long organizationId;
    @ApiModelProperty(name = "tagId")
    private Long tagId;
}
