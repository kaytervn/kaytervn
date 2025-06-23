package com.finance.data.model.api.request.service.group;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupServiceCreateRequest {
    private String name;
    private String description;
}
