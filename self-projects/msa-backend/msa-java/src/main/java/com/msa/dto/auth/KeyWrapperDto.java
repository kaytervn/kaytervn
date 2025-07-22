package com.msa.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KeyWrapperDto {
    private String decryptKey;
    private String encryptKey;
}
