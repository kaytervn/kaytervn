package com.finance.data.model.api.request.key;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KeyGroupCreateRequest {
    private String name;
    private String description;
}
