package com.master.form.group;

import com.master.validation.UserKind;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@ApiModel
public class CreateGroupForm {
    @NotBlank(message = "name cannot be null")
    @ApiModelProperty(name = "name", required = true)
    private String name;
    @NotBlank(message = "description cannot be null")
    @ApiModelProperty(name = "description", required = true)
    private String description;
    @NotNull(message = "permissionIds cannot be null")
    @ApiModelProperty(name = "permissionIds", required = true)
    private List<Long> permissionIds;
}
