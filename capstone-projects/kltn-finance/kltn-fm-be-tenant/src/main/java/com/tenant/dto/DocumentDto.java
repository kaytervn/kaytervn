package com.tenant.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class DocumentDto {
    @JsonProperty("name")
    private String name;
    @JsonProperty("url")
    private String url;
}
