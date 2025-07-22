package com.msa.config.filter.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class AuthHeaderDto {
    private String messageSignature;
    private String clientRequestId;
    private Date timestamp;
    private String apiKey;
    private String requestBody;
    private String origin;
    private String referer;
    private List<String> fingerprint;
}
