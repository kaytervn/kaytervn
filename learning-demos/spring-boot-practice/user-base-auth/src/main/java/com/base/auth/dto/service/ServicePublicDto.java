package com.base.auth.dto.service;

import lombok.Data;

@Data
public class ServicePublicDto {
    private Long id;
    private String serviceName;
    private String servicePath;
    private String address;
    private String logoPath;
    private String bannerPath;
    private String hotline;
    private String settings;
    private String lang;
    private Double latitude;
    private Double longitude;
    private Boolean isReady;
    private Boolean isReadyQrLive;
    private String tenantId;
}
