package com.base.auth.dto.service;

import com.base.auth.dto.account.AccountDto;
import com.base.auth.dto.ABasicAdminDto;
import com.base.auth.model.Group;
import lombok.Data;

@Data
public class ServiceDto extends ABasicAdminDto {
    private String serviceName;
    private Group group;
    private String logoPath;
    private String bannerPath;
    private String hotline;
    private String settings;
    private String lang;
    private Integer status;
    private AccountDto accountDto;

    private String tenantId;
}
