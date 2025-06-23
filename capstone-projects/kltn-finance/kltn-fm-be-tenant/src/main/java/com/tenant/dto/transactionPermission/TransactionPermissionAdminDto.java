package com.tenant.dto.transactionPermission;

import com.tenant.dto.ABasicAdminDto;
import com.tenant.dto.account.AccountDto;
import com.tenant.dto.transaction.TransactionDto;
import com.tenant.dto.transactionGroup.TransactionGroupDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class TransactionPermissionAdminDto extends ABasicAdminDto {
    @ApiModelProperty(name = "permissionKind")
    private Integer permissionKind;
    @ApiModelProperty(name = "account")
    private AccountDto account;
    @ApiModelProperty(name = "transaction")
    private TransactionDto transaction;
    @ApiModelProperty(name = "transactionGroup")
    private TransactionGroupDto transactionGroup;
}
