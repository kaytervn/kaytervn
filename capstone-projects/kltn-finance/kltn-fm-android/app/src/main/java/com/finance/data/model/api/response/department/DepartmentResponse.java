package com.finance.data.model.api.response.department;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponse {
    private String createdDate;
    private String modifiedDate;
    private String name;
    private Long id;
    private Integer status;
    private String description;
}
