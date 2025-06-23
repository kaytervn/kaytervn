package com.tenant.dto.service;

import com.tenant.dto.ABasicAdminDto;
import com.tenant.dto.serviceGroup.ServiceGroupDto;
import com.tenant.dto.tag.TagDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Date;

@Data
public class ServiceAdminDto extends ABasicAdminDto {
    @ApiModelProperty(name = "name")
    private String name;
    @ApiModelProperty(name = "kind")
    private Integer kind;
    @ApiModelProperty(name = "description")
    private String description;
    @ApiModelProperty(name = "money")
    private String money;
    @ApiModelProperty(name = "startDate")
    private Date startDate;
    @ApiModelProperty(name = "periodKind")
    private Integer periodKind;
    @ApiModelProperty(name = "expirationDate")
    private Date expirationDate;
    @ApiModelProperty(name = "serviceGroup")
    private ServiceGroupDto serviceGroup;
    @ApiModelProperty(name = "isPaid")
    private Integer isPaid;
    @ApiModelProperty(name = "tag")
    private TagDto tag;
}
