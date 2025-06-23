package com.master.form.location;

import com.master.validation.StatusConstraint;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
@ApiModel
public class UpdateLocationForm {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(name = "id", required = true)
    private Long id;
    @NotBlank(message = "name cannot be null")
    @ApiModelProperty(name = "name", required = true)
    private String name;
    @ApiModelProperty(name = "logoPath")
    private String logoPath;
    @ApiModelProperty(name = "hotline")
    private String hotline;
    @ApiModelProperty(name = "settings")
    private String settings;
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
