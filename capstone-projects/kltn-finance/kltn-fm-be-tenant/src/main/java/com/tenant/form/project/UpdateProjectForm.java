package com.tenant.form.project;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class UpdateProjectForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(name = "id", required = true)
    private Long id;
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
