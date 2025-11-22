package com.msa.feign.dto;

import lombok.Data;

import java.util.List;

@Data
public class BrevoEmailDto {
    private EmailInfoDto sender;
    private List<EmailInfoDto> to;
    private String subject;
    private String htmlContent;
}
