package com.master.dto.customer;

import com.master.dto.ABasicAdminDto;
import com.master.dto.account.AccountDto;
import com.master.dto.branch.BranchDto;
import lombok.Data;

@Data
public class CustomerDto extends ABasicAdminDto {
    private AccountDto account;
    private String address;
    private String taxNumber;
    private String zipCode;
    private String city;
    private BranchDto branch;
}
