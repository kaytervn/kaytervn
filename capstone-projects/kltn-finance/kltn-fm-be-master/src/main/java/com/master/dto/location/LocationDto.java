package com.master.dto.location;

import com.master.dto.ABasicAdminDto;
import com.master.dto.customer.CustomerDto;
import com.master.dto.dbConfig.DbConfigDto;
import lombok.Data;

import java.util.Date;

@Data
public class LocationDto extends ABasicAdminDto {
    private String tenantId;
    private String name;
    private String logoPath;
    private String hotline;
    private String settings;
    private CustomerDto customer;
    private Date startDate;
    private Date expiredDate;
    private String aesSecretKey;
    private DbConfigDto dbConfig;
}