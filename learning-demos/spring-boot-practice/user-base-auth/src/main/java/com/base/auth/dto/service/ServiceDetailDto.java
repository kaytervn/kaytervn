package com.base.auth.dto.service;

import lombok.Data;

@Data
public class ServiceDetailDto {

    private Long id;
    private String careerName;
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
}
