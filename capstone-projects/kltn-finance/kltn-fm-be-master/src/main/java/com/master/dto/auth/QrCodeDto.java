package com.master.dto.auth;

import lombok.Data;

import java.util.Date;

@Data
public class QrCodeDto {
    private String tenantId;
    private String username;
    private String md5Hash;
    private Date currentTime;
}
