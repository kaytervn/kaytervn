package com.tenant.dto.faceId;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class VerifyFaceIdDto {
    @JsonProperty("user_id")
    private String userId;
    private Double conf;
}
