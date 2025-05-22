package com.base.auth.form.nation;

import com.base.auth.dto.ABasicAdminDto;
import com.base.auth.validation.NationKind;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;


@Data
public class CreateNationForm{
    @NotEmpty(message = "name cant not be null")
    @ApiModelProperty(name = "name", required = true)
    private String name;
    @NotEmpty(message = "postCode cant not be null")
    @ApiModelProperty(name = "postCode", required = true)
    private String postCode;
    @NotNull(message = "kind cant not be null")
    @ApiModelProperty(name = "kind", required = true)
    @NationKind
    private Integer kind;
    @NotNull(message = "status cant not be null")
    @ApiModelProperty(name = "status", required = true)
    private Long status;
    @ApiModelProperty(name = "parentId")
    private Long parentId;
}
