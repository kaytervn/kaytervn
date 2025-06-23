package com.master.form.location;

import com.master.validation.StatusConstraint;
import com.master.validation.UsernameConstraint;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
@ApiModel
public class CreateLocationForm {
    @NotBlank(message = "tenantId cannot be null")
    @UsernameConstraint(message = "tenantId is invalid")
    @ApiModelProperty(name = "tenantId", required = true)
    private String tenantId;
    @NotBlank(message = "name cannot be null")
    @ApiModelProperty(name = "name", required = true)
    private String name;
    @ApiModelProperty(name = "logoPath")
    private String logoPath;
    @ApiModelProperty(name = "hotline")
    private String hotline;
    @NotNull(message = "customerId cannot be null")
    @ApiModelProperty(name = "customerId", required = true)
    private Long customerId;
    @NotNull(message = "startDate cannot be null")
    @ApiModelProperty(required = true)
    private Date startDate;
    @NotNull(message = "expiredDate cannot be null")
    @ApiModelProperty(required = true)
    private Date expiredDate;
    @StatusConstraint
    @ApiModelProperty(required = true)
    private Integer status;
}
