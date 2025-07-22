package com.msa.form.dbCofig;

import com.msa.validation.StatusConstraint;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Data
public class UpdateDbConfigForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(name = "id", required = true)
    private Long id;
    @NotNull(message = "maxConnection cannot be null")
    @Min(value = 1, message = "maxConnection must be greater than or equal to 1")
    @ApiModelProperty(name = "maxConnection", required = true)
    private Integer maxConnection;
    @StatusConstraint
    @ApiModelProperty(required = true)
    private Integer status;
}
