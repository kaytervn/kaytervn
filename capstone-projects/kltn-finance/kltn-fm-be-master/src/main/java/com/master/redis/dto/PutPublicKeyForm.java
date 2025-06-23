package com.master.redis.dto;

import lombok.Data;

@Data
public class PutPublicKeyForm {
    private String key;
    private String publicKey;
}
