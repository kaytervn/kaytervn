package com.finance.data.model.api.response.category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private Long id;
    private Integer status;
    private String createdDate;
    private String modifiedDate;
    private String name;
    private String description;
    private Integer kind;
}
