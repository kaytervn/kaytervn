package com.master.dto.accountBranch;

import com.master.dto.ABasicAdminDto;
import com.master.dto.account.AccountDto;
import com.master.dto.branch.BranchDto;
import lombok.Data;

@Data
public class AccountBranchDto extends ABasicAdminDto {
    private BranchDto branch;
    private AccountDto account;
}