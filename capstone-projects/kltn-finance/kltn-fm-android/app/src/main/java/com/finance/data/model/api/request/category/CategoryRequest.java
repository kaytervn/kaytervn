package com.finance.data.model.api.request.category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {
    private String avatar;
    private String description;
    private String name;
    private Long id;
}
