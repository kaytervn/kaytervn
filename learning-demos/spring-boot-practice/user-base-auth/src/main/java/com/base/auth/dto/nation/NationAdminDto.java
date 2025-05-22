package com.base.auth.dto.nation;

import com.base.auth.dto.ABasicAdminDto;
import com.base.auth.model.Nation;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


@Data
public class NationAdminDto extends ABasicAdminDto {
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "postCode")
    private String postCode;
    @ApiModelProperty(name = "kind")
    private Integer kind;
    @ApiModelProperty(name = "parent")
    private NationDto parent;
}
