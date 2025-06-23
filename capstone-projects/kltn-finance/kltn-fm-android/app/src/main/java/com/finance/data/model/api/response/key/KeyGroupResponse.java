package com.finance.data.model.api.response.key;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KeyGroupResponse {
    private Long id;
    private String name;
    private String description;
}
