package com.msa.form.group;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Data
public class CreateGroupForm {
    @NotBlank(message = "name cannot be null")
    @ApiModelProperty(name = "name", required = true)
    private String name;
    @NotNull(message = "permissionIds cannot be null")
    @Size(min = 1, message = "At least one permission is required")
    @ApiModelProperty(name = "permissionIds", required = true)
    private List<Long> permissionIds;
}