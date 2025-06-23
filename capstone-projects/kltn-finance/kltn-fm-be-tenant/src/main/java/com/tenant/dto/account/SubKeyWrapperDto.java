package com.tenant.dto.account;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SubKeyWrapperDto {
    private String decryptKey;
    private String encryptKey;
}
