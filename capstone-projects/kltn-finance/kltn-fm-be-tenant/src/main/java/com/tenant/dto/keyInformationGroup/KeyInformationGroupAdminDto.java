package com.tenant.dto.keyInformationGroup;

import com.tenant.dto.ABasicAdminDto;
import com.tenant.dto.keyInformation.KeyInformationDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

@Data
public class KeyInformationGroupAdminDto extends ABasicAdminDto {
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "description")
    private String description;
    @ApiModelProperty(name = "keyInformations")
    private List<KeyInformationDto> keyInformations;
}