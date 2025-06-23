package com.master.dto.account;

import lombok.Data;

@Data
public class VerifyCredentialDto {
    private Boolean isMfa;
    private Boolean isMfaEnable;
    private String qrUrl;
}
