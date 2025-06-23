package com.finance.data.model.api.request.department;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentUpdateRequest {
    private String name;
    private Integer status;
    private Long id;
    private String description;
}
