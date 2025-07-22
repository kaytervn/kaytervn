package com.msa.dto.backupCode;

import com.msa.dto.ABasicAdminDto;
import com.msa.dto.account.AccountDto;
import lombok.Data;

@Data
public class BackupCodeDto extends ABasicAdminDto {
    private String code;
    private AccountDto account;
}