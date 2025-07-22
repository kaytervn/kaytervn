package com.msa.form.user;

import com.msa.validation.EmailConstraint;
import com.msa.validation.StatusConstraint;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class UpdateUserForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(required = true)
    private Long id;
    @EmailConstraint
    @ApiModelProperty(required = true)
    private String email;
    private Long groupId;
    @StatusConstraint
    @ApiModelProperty(required = true)
    private Integer status;
}
