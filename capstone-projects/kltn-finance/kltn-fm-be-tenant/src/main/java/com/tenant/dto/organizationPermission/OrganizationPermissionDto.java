package com.tenant.dto.organizationPermission;

import com.tenant.dto.account.AccountDto;
import com.tenant.dto.organization.OrganizationDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class OrganizationPermissionDto {
    @ApiModelProperty(name = "id")
    private Long id;
    @ApiModelProperty(name = "account")
    private AccountDto account;
    @ApiModelProperty(name = "organization")
    private OrganizationDto organization;
}
