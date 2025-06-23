package com.tenant.multitenancy.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ImagePayloadDto {
    @JsonProperty("image_data")
    private String imageData;
    @JsonProperty("user_id")
    private String userId;
}
