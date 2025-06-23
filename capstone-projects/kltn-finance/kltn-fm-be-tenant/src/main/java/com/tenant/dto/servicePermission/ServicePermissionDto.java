package com.tenant.dto.servicePermission;

import com.tenant.dto.account.AccountDto;
import com.tenant.dto.service.ServiceDto;
import com.tenant.dto.serviceGroup.ServiceGroupDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ServicePermissionDto {
    @ApiModelProperty(name = "id")
    private Long id;
    @ApiModelProperty(name = "permissionKind")
    private Integer permissionKind;
    @ApiModelProperty(name = "account")
    private AccountDto account;
    @ApiModelProperty(name = "service")
    private ServiceDto service;
    @ApiModelProperty(name = "serviceGroup")
    private ServiceGroupDto serviceGroup;
}
