package com.finance.data.model.api.request.department;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentCreateRequest {
    private String name;
    private Integer status;
    private String description;
}
