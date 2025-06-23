package com.tenant.dto.account;

import lombok.Data;

import java.util.Date;

@Data
public class QrCodeDto {
    private String clientId;
    private Date currentTime;
}
