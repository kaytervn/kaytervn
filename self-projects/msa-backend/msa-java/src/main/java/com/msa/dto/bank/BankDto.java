package com.msa.dto.bank;

import com.msa.dto.ABasicAdminDto;
import com.msa.dto.tag.TagDto;
import lombok.Data;

@Data
public class BankDto extends ABasicAdminDto {
    private String username;
    private String password;
    private String numbers;
    private String pins;
    private TagDto tag;
}
