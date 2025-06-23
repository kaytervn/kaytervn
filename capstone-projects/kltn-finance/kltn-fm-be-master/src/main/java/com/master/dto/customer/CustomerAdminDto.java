package com.master.dto.customer;

import com.master.dto.ABasicAdminDto;
import com.master.dto.account.AccountDto;
import com.master.dto.branch.BranchDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class CustomerAdminDto extends ABasicAdminDto {
    @ApiModelProperty(name = "account")
    private AccountDto account;
    @ApiModelProperty(name = "branch")
    private BranchDto branch;
}
