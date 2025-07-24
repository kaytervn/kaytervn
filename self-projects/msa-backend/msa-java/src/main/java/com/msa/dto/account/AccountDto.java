package com.msa.dto.account;

import com.msa.dto.ABasicAdminDto;
import com.msa.dto.platform.PlatformDto;
import com.msa.dto.tag.TagDto;
import lombok.Data;

@Data
public class AccountDto extends ABasicAdminDto {
    private Integer kind;
    private String username;
    private String password;
    private String note;
    private PlatformDto platform;
    private AccountDto parent;
    private Integer totalBackupCodes;
    private Integer totalChildren;
    private TagDto tag;
}