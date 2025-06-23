package com.tenant.form.service;

import com.tenant.validation.ServiceKind;
import com.tenant.validation.ServicePeriodKind;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
public class CreateServiceForm {
    @NotBlank(message = "name cannot be null")
    @ApiModelProperty(name = "name", required = true)
    private String name;
    @ServiceKind
    @NotNull(message = "kind cannot be null")
    @ApiModelProperty(name = "kind", required = true)
    private Integer kind;
    @ApiModelProperty(name = "description")
    private String description;
    @NotNull(message = "money cannot be null")
    @ApiModelProperty(name = "money", required = true)
    private Double money;
    @NotNull(message = "startDate cannot be null")
    @ApiModelProperty(name = "startDate", required = true)
    private Date startDate;
    @ServicePeriodKind
    @NotNull(message = "periodKind cannot be null")
    @ApiModelProperty(name = "periodKind", required = true)
    private Integer periodKind;
    @ApiModelProperty(name = "expirationDate")
    private Date expirationDate;
    @NotNull(message = "serviceGroupId cannot be null")
    @ApiModelProperty(name = "serviceGroupId", required = true)
    private Long serviceGroupId;
    @ApiModelProperty(name = "tagId")
    private Long tagId;
}
