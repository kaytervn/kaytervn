package com.msa.cache.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SessionDto {
    private String session;
    private String publicKey;

    public SessionDto(String session) {
        this.session = session;
    }
}

