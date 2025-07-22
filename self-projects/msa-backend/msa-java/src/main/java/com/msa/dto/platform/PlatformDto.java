package com.msa.dto.platform;

import com.msa.dto.ABasicAdminDto;
import lombok.Data;

@Data
public class PlatformDto extends ABasicAdminDto {
    private String name;
    private String url;
    private Integer totalAccounts;
}